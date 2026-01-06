export const getCurrentTabUrl = (): Promise<{
  domain: string | null;
  url: string | null;
}> => {
  return new Promise((resolve) => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs: chrome.tabs.Tab[]) => {
        if (tabs[0]?.url) {
          const url = new URL(tabs[0].url);
          const domain = url.hostname;
          resolve({ domain, url: tabs[0].url });
        } else {
          resolve({ domain: null, url: null });
        }
      },
    );
  });
};
