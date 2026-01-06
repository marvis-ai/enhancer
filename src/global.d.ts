import { Story } from '@/features/hacker-news/types';

interface EnhancedSiteProps {
  title: string;
  domain: string;
  className: string;
}

interface Window {
  __ENHANCER_AI_STORIES__?: Story[];
}
