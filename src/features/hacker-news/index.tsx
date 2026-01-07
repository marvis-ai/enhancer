import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';
import { HackerNewsApp } from '@/features/hacker-news/Application';

// Wait for root element to be ready
function mountApp() {
  const root = document.getElementById('enhancer-ai-root');
  root?.classList.add('dark');
  if (root) {
    createRoot(root).render(
      <StrictMode>
        <HackerNewsApp />
      </StrictMode>,
    );
  }
}

// Mount app immediately when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
