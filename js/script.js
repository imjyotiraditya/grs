/**
 * Main script for GitHub Release Stats
 * Initializes the application and handles the main logic flow
 */

import API from "./api.js";
import UI from "./ui.js";

/**
 * Main function to fetch repository statistics
 */
async function fetchRepositoryStats() {
  const repoUrl = UI.elements.repoUrlInput.value.trim();
  if (!repoUrl) {
    UI.showStatus(
      UI.elements.repoStatus,
      "Please enter a GitHub repository URL",
      "error"
    );
    return;
  }

  try {
    // Reset UI state
    UI.showResults(false);
    UI.showError(false);
    UI.showLoading(true);

    // Parse GitHub URL
    const { username, repoName } = API.parseGitHubUrl(repoUrl);

    // Fetch repository info
    const repoInfo = await API.getRepositoryInfo(username, repoName);

    // Fetch repository releases
    const releases = await API.getRepositoryReleases(username, repoName);

    // Update UI with repository stats
    UI.updateRepositoryInfo(repoInfo, releases, username, repoName);

    // Show results
    UI.showLoading(false);
    UI.showResults(true);
  } catch (error) {
    console.error("Error:", error);
    UI.showLoading(false);
    UI.showError(true, error.message);
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  UI.init(fetchRepositoryStats);

  // Check for pre-filled repository URL in query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const prefilledRepo = urlParams.get("r");

  if (prefilledRepo) {
    UI.elements.repoUrlInput.value = prefilledRepo;
    fetchRepositoryStats();
  }
});

// Export the main function for potential testing
export { fetchRepositoryStats };
