// Content script for Hacker News
// This script hides the original design and scrapes the content

interface Story {
  id: string;
  rank: number;
  title: string;
  url: string;
  domain: string;
  points: number;
  user: string;
  time: string;
  commentsCount: number;
  commentsUrl: string;
}

// Hide the original HN design
function hideOriginalDesign() {
  const center = document.querySelector('center');
  if (center) {
    center.style.display = 'none';
  }
}

// Scrape stories from the original HN page
function scrapeStories(): Story[] {
  const stories: Story[] = [];
  const itemRows = document.querySelectorAll('tr.athing');

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
      if (!metaRow) return;

      const scoreElement = metaRow.querySelector('.score');
      const points = parseInt(scoreElement?.textContent?.split(' ')[0] || '0');

      const userElement = metaRow.querySelector('.hnuser');
      const user = userElement?.textContent || '';

      const ageElement = metaRow.querySelector('.age');
      const time = ageElement?.textContent || '';

      const subtextLinks = metaRow.querySelectorAll('.subtext > a');
      const commentsLink = subtextLinks[subtextLinks.length - 1];
      let commentsCount = 0;
      let commentsUrl = '';

      if (commentsLink) {
        const commentsText = commentsLink.textContent || '';
        if (commentsText.includes('comment')) {
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

// Initialize the enhanced UI
function init() {
  // Hide original design
  hideOriginalDesign();

  // Add id to body tag for React to mount
  document.body.id = 'enhancer-ai-root';

  // Scrape stories and store them
  const stories = scrapeStories();

  // Store stories in a global variable for the React app to access
  interface EnhancerWindow extends Window {
    __ENHANCER_AI_STORIES__?: typeof stories;
  }
  (window as EnhancerWindow).__ENHANCER_AI_STORIES__ = stories;

  // Dispatch event to notify that data is ready (use setTimeout to ensure body id is set)
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
