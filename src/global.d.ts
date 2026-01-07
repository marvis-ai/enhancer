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

interface EnhancedSiteProps {
  title: string;
  domain: string;
  className: string;
}

interface Window {
  __ENHANCER_AI_STORIES__?: Story[];
  __ENHANCER_AI_FETCH_PAGE__?: (pageNum: number) => Promise<Story[]>;
}
