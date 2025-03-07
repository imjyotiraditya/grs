# GitHub Release Stats

A clean, minimalist web app that provides simple release analytics for GitHub repositories. This tool helps you visualize release patterns, download statistics, and version history at a glance.

## Features

- Quick repository lookup via GitHub URL or username/repository format
- View key metrics including total releases, latest version, and assets count
- Calculate average release frequency and download statistics
- Detailed table of all releases with version, date, and download information
- Expandable assets view for each release with detailed download stats
- Clear distinction between stable releases and pre-releases
- Shareable results via URL parameters
- Fully responsive design that works on desktop and mobile

## Usage

1. Enter a GitHub repository URL in the search box
   - Examples:
     - `https://github.com/username/repository`
     - `username/repository`
2. Click "Get Stats" or press Enter
3. View the comprehensive release statistics
   - Total number of releases
   - Latest version
   - Total number of assets across all releases
   - Average time between releases
   - Total and average download counts
   - Detailed breakdown of all versions

## Quick Access with URL Parameters

You can directly access repository statistics by using the `r` parameter in the URL:

```
https://jyotiraditya.dev/grs?r=username/repository
```

or

```
https://jyotiraditya.dev/grs?r=https://github.com/username/repository
```

This allows you to bookmark favorite repositories or share links directly to specific repository stats.

## Share Your Results

After analyzing a repository, you can share your results with others by clicking the "Share Results" button. This will copy a link to your clipboard that others can use to view the same repository stats.

## Live Demo

Check out the live version at: [https://jyotiraditya.dev/grs](https://jyotiraditya.dev/grs)

## How It Works

GitHub Release Stats uses the GitHub API to fetch repository and release data:

1. The app parses the provided GitHub URL (or username/repo format) to extract username and repository name
2. It fetches the repository metadata via the GitHub API
3. It retrieves all releases for the repository
4. The data is processed to calculate statistics like release frequency and download counts
5. The UI is updated to display the information in a clean, easy-to-understand format

## Interactive Elements

- Click on any release row to view detailed asset information
- Use the share button to generate a shareable link
- Status notifications appear when actions are performed (like copying links)

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
