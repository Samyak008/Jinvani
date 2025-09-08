#   Behenshree na Vachnamrut🙏

A desktop productivity + spiritual reflection app that periodically shows translucent popup reminders with thoughts from spiritual books. Built with Electron and TypeScript.

## Features

- **Periodic Reminders**: Shows spiritual thoughts every 30 minutes (configurable)
- **Beautiful UI**: Translucent, gradient-styled popups with smooth animations
- **Spiritual Content**: 8 thoughts from Vachanamrut in Gujarati with English translations
- **Background Operation**: Runs in system tray, non-intrusive
- **User Acknowledgment**: Must click "OK" or press Enter/Space to acknowledge
- **Keyboard Shortcuts**: Enter/Space to acknowledge, Escape to close
- **State Tracking**: Tracks daily reading streaks and progress
- **Configurable**: Adjustable intervals, opacity, positioning

## Quick Start

```bash
# Install dependencies
npm install

# Build and run the application
npm start

# For development (rebuild on changes)
npm run dev
```

## Project Structure

```
thought-reminder/
├── package.json          # Project configuration and dependencies
├── tsconfig.json         # TypeScript configuration
├── src/
│   ├── main.ts           # Electron main process
│   ├── preload.ts        # Safe bridge between main & renderer
│   ├── core/
│   │   ├── scheduler.ts  # Timer logic for reminders
│   │   └── popupManager.ts # Handles popup creation/destroy
│   ├── content/
│   │   ├── thoughts.json # Spiritual book excerpts
│   │   └── contentManager.ts # Fetches today's thought
│   ├── storage/
│   │   ├── config.json   # User settings
│   │   └── state.json    # Daily read state tracking
│   └── ui/
│       ├── popup.html    # Popup window structure
│       ├── style.css     # Beautiful gradient styling
│       └── renderer.ts   # Renderer logic for popup
└── dist/                 # Built JavaScript files
```

## Configuration

The app uses `src/storage/config.json` for settings:

```json
{
  "interval": 1800000,     // 30 minutes in milliseconds
  "enabled": true,         // Enable/disable reminders
  "opacity": 0.95,         // Window opacity (0-1)
  "alwaysOnTop": true,     // Keep popup on top
  "centerPosition": true,  // Center popup on screen
  "reminderDuration": 10000, // Auto-close after 10 seconds
  "autoStart": true        // Start scheduler on app launch
}
```

## How It Works

1. **Scheduler**: Runs timer based on configured interval
2. **Content Manager**: Selects today's thought and tracks reading state
3. **Popup Manager**: Creates beautiful, translucent popup windows
4. **User Interaction**: User must acknowledge thought to continue work
5. **State Persistence**: Tracks streaks and ensures one thought per day

## Spiritual Content

Currently includes 8 thoughts from **Vachanamrut** (Swaminarayan scripture):
- Original text in Gujarati
- English translations
- Source references
- Themes: devotion, spiritual practice, liberation

## Development

### Tech Stack
- **Electron**: Cross-platform desktop app framework
- **TypeScript**: Type-safe JavaScript development
- **HTML/CSS**: Beautiful, responsive UI
- **Node.js**: File system and timer management

### Building
```bash
npm run build  # Compile TypeScript and copy assets
npm run dev    # Quick development build
```

### Testing
```bash
node test.js         # Test configuration and build
node test-modules.js # Test core functionality
```

## Future Enhancements

The system is designed to be extensible:

- **AI Integration**: Upload any book, generate smart thoughts
- **Custom Scheduling**: Fixed intervals, random times, streak tracking
- **Do Not Disturb**: Context awareness for fullscreen/focus mode
- **Multiple Books**: Switch between different spiritual texts
- **Themes**: Customizable UI themes and styling
- **Analytics**: Detailed reading statistics and insights

## System Tray

The app runs in the system tray with options:
- Show Reminder Now
- Toggle Scheduler (Pause/Resume)
- View Statistics
- Quit Application

## Keyboard Shortcuts

- **Enter** or **Space**: Acknowledge and close popup
- **Escape**: Close popup without acknowledging

## License

MIT License - Built for spiritual growth and mindful productivity.