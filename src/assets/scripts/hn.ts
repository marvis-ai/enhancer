// Content script for Hacker News
// This script hides the original design and scrapes the content

// Immediately inject loading overlay using MutationObserver
(function () {
  'use strict';

  // Create loading overlay
  const loadingWrap = document.createElement('div');
  loadingWrap.id = 'enhancer-ai-loading';
  loadingWrap.style.cssText =
    'position:fixed; width:100%; height:100%; left:0; top:0; z-index:99999; background:#fff;';

  // Create loading content
  const loadingInner = document.createElement('div');
  loadingInner.style.cssText =
    'position:absolute; width:100%; height:100%; left:0; top:0; display:flex; align-items:center; justify-content:center;';
  loadingInner.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:1rem; animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-snail size-16 text-pink-500" aria-hidden="true"><path d="M2 13a6 6 0 1 0 12 0 4 4 0 1 0-8 0 2 2 0 0 0 4 0"></path><circle cx="10" cy="13" r="8"></circle><path d="M2 21h12c4.4 0 8-3.6 8-8V7a2 2 0 1 0-4 0v6"></path><path d="M18 3 19.1 5.2"></path><path d="M22 3 20.9 5.2"></path></svg>
      <h1 class="flex items-center gap-2" style="font-size:2.25rem; font-weight:200; color:#3f3f46;">Enhancer AI<span style="font-weight:400; font-size: 1.2rem; color:#eee;">for </span><span style="font-weight:600; font-size: 1.6rem; color:#f97316;">Hacker News</span></h1>
    </div>
    <style>
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    </style>
  `;
  loadingWrap.appendChild(loadingInner);

  // Inject CSS to hide original content
  const style = document.createElement('style');
  style.textContent = `
    body > center {
      display: none !important;
    }
  `;

  // Use MutationObserver to wait for body
  const observer = new MutationObserver(function () {
    if (document.body) {
      // Add loading overlay
      document.body.appendChild(loadingWrap);

      // Add style to hide original content
      if (document.head) {
        document.head.appendChild(style);
      }

      // Disconnect observer
      observer.disconnect();
    }
  });

  observer.observe(document.documentElement, { childList: true });
})();

// Remove loading screen with minimum 1 second delay
async function hideLoadingScreen() {
  const loadingDiv = document.getElementById('enhancer-ai-loading');
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

// Scrape stories from the original HN page or a fetched page
function scrapeStories(doc: Document = document): Story[] {
  const stories: Story[] = [];
  const itemRows = doc.querySelectorAll('tr.athing');

  itemRows.forEach((row) => {
    try {
      const id = row.getAttribute('id') || '';
      const rankText = row.querySelector('.rank')?.textContent || '';
      const rank = parseInt(rankText.replace('.', '')) || 0;

      const titleElement = row.querySelector('.titleline > a');
      const title = titleElement?.textContent || '';
      const url = titleElement?.getAttribute('href') || '';

      const domainElement = row.querySelector('.sitestr');
      const domain = domainElement?.textContent || '';

      const metaRow = row.nextElementSibling;
      if (!metaRow) {
        console.warn('Story row missing metadata sibling:', id);
        return;
      }

      const scoreElement = metaRow.querySelector('.score');
      const points = parseInt(scoreElement?.textContent?.split(' ')[0] || '0');

      const userElement = metaRow.querySelector('.hnuser');
      const user = userElement?.textContent || '';

      const ageElement = metaRow.querySelector('.age');
      const time = ageElement?.textContent || '';

      const subtextLinks = metaRow.querySelectorAll('.subtext .subline > a');
      const commentsLink = Array.from(subtextLinks).find(
        (link) =>
          link.textContent?.includes('comment') ||
          link.textContent?.includes('discuss'),
      );
      let commentsCount = 0;
      let commentsUrl = '';

      if (commentsLink) {
        const commentsText = commentsLink.textContent || '';
        if (commentsText.includes('discuss')) {
          // Handle "discuss" case - no comments but discussion link exists
          commentsCount = 0;
        } else {
          // Handle "X comments" case
          commentsCount = parseInt(commentsText.split(/\s+/)[0]) || 0;
        }
        commentsUrl = commentsLink.getAttribute('href') || '';
        if (commentsUrl && !commentsUrl.startsWith('http')) {
          commentsUrl = `https://news.ycombinator.com/${commentsUrl}`;
        }
      }

      stories.push({
        id,
        rank,
        title,
        url,
        domain,
        points,
        user,
        time,
        commentsCount,
        commentsUrl,
      });
    } catch (e) {
      console.error('Error parsing row', e);
    }
  });

  return stories;
}

// Parse the next page URL from the "More" link
function getNextPageUrl(doc: Document): string | null {
  const moreLink = doc.querySelector('a.morelink[rel="next"]');
  if (!moreLink) {
    return null;
  }

  const href = moreLink.getAttribute('href');
  if (!href) {
    return null;
  }

  // Return the full URL
  if (href.startsWith('http')) {
    return href;
  }

  // Handle relative URLs
  return `${window.location.origin}${href.startsWith('/') ? href : '/' + href}`;
}

// Map section IDs to HN URLs
function getSectionUrl(section: string): string {
  const sectionMap: Record<string, string> = {
    home: '/',
    new: '/newest',
    past: '/front',
    comments: '/newcomments',
    ask: '/ask',
    show: '/show',
    jobs: '/jobs',
  };
  return sectionMap[section] || '/';
}

// Store the next page URL for each section
const nextPageUrls: Record<string, string | null> = {};

// Fetch and scrape stories from a specific URL
async function fetchFromUrl(
  url: string,
): Promise<{ stories: Story[]; nextPageUrl: string | null }> {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const stories = scrapeStories(doc);
    const nextPageUrl = getNextPageUrl(doc);

    return { stories, nextPageUrl };
  } catch (e) {
    console.error('Error fetching from URL:', e);
    return { stories: [], nextPageUrl: null };
  }
}

// Fetch and scrape stories from a specific section
async function fetchSection(
  section: string,
  isNextPage: boolean = false,
): Promise<{ stories: Story[]; hasMore: boolean }> {
  try {
    let url: string;

    if (isNextPage && nextPageUrls[section]) {
      // Use the stored next page URL
      url = nextPageUrls[section]!;
    } else {
      // First page of the section
      const sectionPath = getSectionUrl(section);
      url = `${window.location.origin}${sectionPath}`;
    }

    const { stories, nextPageUrl } = await fetchFromUrl(url);

    // Store the next page URL for this section
    nextPageUrls[section] = nextPageUrl;

    return { stories, hasMore: nextPageUrl !== null };
  } catch (e) {
    console.error('Error fetching section:', e);
    return { stories: [], hasMore: false };
  }
}

// Expose fetch functions globally for React app to use
interface EnhancerWindow extends Window {
  __ENHANCER_AI_FETCH_SECTION__?: (
    section: string,
    isNextPage?: boolean,
  ) => Promise<{ stories: Story[]; hasMore: boolean }>;
}
(window as EnhancerWindow).__ENHANCER_AI_FETCH_SECTION__ = fetchSection;

// Initialize the enhanced UI
function init() {
  // Create dedicated mount element for React
  const mount = document.createElement('div');
  mount.id = 'enhancer-ai-root';
  document.body.appendChild(mount);

  // Scrape stories and store them
  const stories = scrapeStories();

  // Extract and store the next page URL from the initial page
  const nextPageUrl = getNextPageUrl(document);

  // Determine the current section from the URL
  const path = window.location.pathname;
  let currentSection = 'home';
  if (path === '/newest') currentSection = 'new';
  else if (path === '/front') currentSection = 'past';
  else if (path === '/newcomments') currentSection = 'comments';
  else if (path === '/ask') currentSection = 'ask';
  else if (path === '/show') currentSection = 'show';
  else if (path === '/jobs') currentSection = 'jobs';

  // Store the next page URL for the current section
  nextPageUrls[currentSection] = nextPageUrl;

  // Store stories in a global variable for the React app to access
  window.__ENHANCER_AI_STORIES__ = stories;

  // Dispatch event to notify that data is ready
  // setTimeout ensures the UI script has attached its event listener
  setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent('enhancer-ai-data-ready', {
        detail: { stories, hasMore: nextPageUrl !== null },
      }),
    );
    // Hide loading screen once data is ready
    hideLoadingScreen();
  }, 0);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
