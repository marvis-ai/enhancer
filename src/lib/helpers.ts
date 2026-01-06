export const getCurrentTabUrl = async (): Promise<{
  domain: string | null;
  url: string | null;
}> => {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.url) {
      const url = new URL(tabs[0].url);
      const domain = url.hostname;
      return { domain, url: tabs[0].url };
    }
    return { domain: null, url: null };
  } catch (error) {
    console.error('Error querying tabs:', error);
    return { domain: null, url: null };
  }
};
