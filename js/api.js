/**
 * GitHub API interaction module
 * Handles all communication with the GitHub API
 */

const API = {
  /**
   * Parse a GitHub URL to extract username and repository name
   * @param {string} url - GitHub repository URL or shorthand
   * @returns {Object} Object containing username and repoName
   */
  parseGitHubUrl(url) {
    try {
      // Trim and remove any leading/trailing whitespace
      url = url.trim();

      // Check if it's already in username/repo format
      const simplePattern = /^([^\/]+)\/([^\/]+)$/;
      const simpleMatch = url.match(simplePattern);
      if (simpleMatch) {
        return {
          username: simpleMatch[1],
          repoName: simpleMatch[2],
        };
      }

      // Match GitHub URL patterns to extract username and repo name
      const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/i;
      const match = url.match(urlPattern);

      if (match && match.length >= 3) {
        const username = match[1];
        let repoName = match[2];

        // Remove trailing .git or any URL parameters
        repoName = repoName
          .replace(/\.git$/, "")
          .split("?")[0]
          .split("#")[0];

        return { username, repoName };
      }

      throw new Error("Invalid GitHub repository URL");
    } catch (error) {
      throw new Error("Invalid GitHub repository URL");
    }
  },

  /**
   * Fetch repository information from GitHub API
   * @param {string} username - GitHub username
   * @param {string} repoName - Repository name
   * @returns {Promise<Object>} Repository information
   */
  async getRepositoryInfo(username, repoName) {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}`,
    );

    if (!response.ok) {
      throw new Error(`Repository not found: ${username}/${repoName}`);
    }

    return response.json();
  },

  /**
   * Fetch releases for a repository from GitHub API
   * @param {string} username - GitHub username
   * @param {string} repoName - Repository name
   * @returns {Promise<Array>} Array of releases
   */
  async getRepositoryReleases(username, repoName) {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/releases`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch repository releases");
    }

    return response.json();
  },
};

export default API;
