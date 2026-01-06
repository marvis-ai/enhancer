# Enhancer AI

A modern browser extension that enhances the reading experience on news sites with a beautiful, clean UI.

## Features

- 🎨 **Modern UI Design** - Clean, readable interface with improved typography
- 🌓 **Dark Mode Support** - Automatic dark mode based on system preferences
- 📱 **Responsive Design** - Works great on all screen sizes
- ⚙️ **Customizable Settings** - Adjust font size, enable compact mode
- 📊 **Reading Progress Bar** - Visual indicator of scroll progress
- 🔝 **Scroll to Top Button** - Quick navigation back to the top
- 🏷️ **Domain Badges** - See the source domain at a glance
- 💬 **Enhanced Comments** - Better visual hierarchy for comment threads

## Installation

### Chrome / Edge / Brave

1. Build the extension:

   ```bash
   pnpm install
   pnpm build
   ```

2. Open your browser and navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`

3. Enable "Developer mode" (toggle in top-right corner)

4. Click "Load unpacked" and select the `dist` folder

### Safari

Safari requires additional steps for extension conversion. Follow Apple's documentation for converting web extensions to Safari.

## Development

### Prerequisites

- Node.js 16+
- pnpm (or npm/yarn)

### Setup

```bash
# Install dependencies
pnpm install

# Generate icons
pnpm generate-icons

# Build for production
pnpm build

# Development mode (for popup UI)
pnpm dev
```

### Project Structure

```
enhancer-ai/
├── manifest.json          # Extension manifest (v3)
├── popup.html            # Extension popup UI
├── src/
│   ├── content.js        # Content script (runs on HN)
│   ├── content.css       # Content styles
│   ├── popup.js          # Popup logic
│   └── popup.css         # Popup styles
├── public/
│   └── icons/            # Extension icons
├── scripts/
│   └── generate-icons.js # Icon generation script
└── dist/                 # Built extension (after build)
```

## Usage

1. Visit [Hacker News](https://news.ycombinator.com)
2. The extension automatically enhances the page
3. Click the extension icon to access settings
4. Customize appearance to your preference

## Settings

- **Enable Enhancement** - Toggle the modern UI on/off
- **Font Size** - Choose between Small, Medium, or Large
- **Compact Mode** - Reduce spacing for denser content layout

## Browser Compatibility

- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Brave
- ✅ Opera
- ⚠️ Safari (requires conversion)
- ❌ Firefox (requires manifest v2 version)

## Roadmap

- [ ] Support for more news/RSS websites
- [ ] Custom theme colors
- [ ] Keyboard shortcuts
- [ ] Save articles for later
- [ ] Export/import settings
- [ ] Firefox support (manifest v2)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

Inspired by [Modern for Hacker News](https://chrome.google.com/webstore/detail/modern-for-hacker-news/dabkegjlekdcmefifaolmdhnhdcplklo)

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.
