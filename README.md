# GitHub Release Stats

A clean, minimalist web app that provides simple release analytics for GitHub repositories. This tool helps you visualize release patterns, download statistics, and version history at a glance.

## Features

- Quick repository lookup via GitHub URL
- View key metrics including total releases, latest version, and assets count
- Calculate average release frequency
- Detailed table of all releases with version, date, and download information
- Clear distinction between stable releases and pre-releases
- Fully responsive design that works on desktop and mobile

## Usage

1. Enter a GitHub repository URL in the search box
   - Example: `https://github.com/username/repository`
2. Click "Get Stats" or press Enter
3. View the comprehensive release statistics
   - Total number of releases
   - Latest version
   - Total number of assets across all releases
   - Average time between releases
   - Detailed breakdown of all versions

## Live Demo

Check out the live version at: [https://jyotiraditya.dev/grs](https://jyotiraditya.dev/grs)

## How It Works

GitHub Release Stats uses the GitHub API to fetch repository and release data:

1. The app parses the provided GitHub URL to extract username and repository name
2. It fetches the repository metadata via the GitHub API
3. It retrieves all releases for the repository
4. The data is processed to calculate statistics like release frequency
5. The UI is updated to display the information in a clean, easy-to-understand format

## Technical Details

This project is built with vanilla JavaScript using ES6 modules for clean organization:

- `script.js` - Main application logic
- `api.js` - GitHub API interaction
- `ui.js` - DOM manipulation and UI updates
- `utils.js` - Helper functions for data formatting and calculations

The app uses a dark theme optimized for readability with a monospace aesthetic to appeal to developers.

## Limitations

- Uses the public GitHub API, which has rate limits
- Only displays releases published through GitHub's release feature (not all tags)
- Limited to 100 releases per repository (GitHub API pagination limit)

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve this tool.

## License

[MIT License](LICENSE)

---

Made for the GitHub community
