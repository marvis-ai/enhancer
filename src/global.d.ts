interface HNStory {
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

interface HNComment {
  id: string;
  username: string;
  timestamp: string;
  title: string;
  titleUrl: string;
  body: string;
  timeAgo: string;
}

interface EnhancedSiteProps {
  title: string;
  domain: string;
  className: string;
}

interface Window {
  __ENHANCER_AI_STORIES__?: HNStory[];
  __ENHANCER_AI_COMMENTS__?: HNComment[];
  __ENHANCER_AI_FETCH_SECTION__?: (
    section: string,
    isNextPage?: boolean,
  ) => Promise<
    | { stories: Story[]; hasMore: boolean }
    | { comments: HNComment[]; hasMore: boolean }
  >;
}
