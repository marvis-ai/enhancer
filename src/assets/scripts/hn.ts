// Content script for Hacker News
// This script hides the original design and scrapes the content

// Hide the original HN design
function hideOriginalDesign() {
  const center = document.querySelector('center');
  if (center) {
    center.style.display = 'none';
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
      const commentsLink = Array.from(subtextLinks).find((link) =>
        link.textContent?.includes('comment'),
      );
      let commentsCount = 0;
      let commentsUrl = '';

      if (commentsLink) {
        const commentsText = commentsLink.textContent || '';
        commentsCount = parseInt(commentsText.split(/\s+/)[0]) || 0;
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

// Fetch and scrape stories from a specific page
async function fetchPage(pageNum: number): Promise<Story[]> {
  try {
    const url = `${window.location.origin}${window.location.pathname}?p=${pageNum}`;
    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return scrapeStories(doc);
  } catch (e) {
    console.error('Error fetching page:', e);
    return [];
  }
}

// Expose fetch function globally for React app to use
interface EnhancerWindow extends Window {
  __ENHANCER_AI_FETCH_PAGE__?: (pageNum: number) => Promise<Story[]>;
}
(window as EnhancerWindow).__ENHANCER_AI_FETCH_PAGE__ = fetchPage;

// Initialize the enhanced UI
function init() {
  // Hide original design
  hideOriginalDesign();

  // Create dedicated mount element for React
  const mount = document.createElement('div');
  mount.id = 'enhancer-ai-root';
  document.body.appendChild(mount);

  // Scrape stories and store them
  const stories = scrapeStories();

  // Store stories in a global variable for the React app to access
  window.__ENHANCER_AI_STORIES__ = stories;

  // Dispatch event to notify that data is ready
  // setTimeout ensures the UI script has attached its event listener
  setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent('enhancer-ai-data-ready', { detail: { stories } }),
    );
  }, 0);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
