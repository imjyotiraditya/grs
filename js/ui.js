/**
 * UI management module for GitHub Release Stats
 * Handles all DOM interactions and UI updates
 */

import Utils from "./utils.js";

const UI = {
  elements: {
    // Input elements
    repoUrlInput: document.getElementById("repo-url"),
    getStatsBtn: document.getElementById("get-stats"),

    // Status and container elements
    repoStatus: document.getElementById("repo-status"),
    resultsContainer: document.getElementById("results-container"),
    loadingIndicator: document.getElementById("loading-indicator"),
    errorContainer: document.getElementById("error-container"),
    errorMessage: document.getElementById("error-message"),

    // Repository info elements
    repoName: document.getElementById("repo-name"),
    repoFullName: document.getElementById("repo-full-name"),
    repoDescription: document.getElementById("repo-description"),
    totalReleases: document.getElementById("total-releases"),
    latestVersion: document.getElementById("latest-version"),
    totalAssets: document.getElementById("total-assets"),
    releaseFrequency: document.getElementById("release-frequency"),
    totalDownloads: document.getElementById("total-downloads"),
    avgDownloads: document.getElementById("avg-downloads"),
    releasesTableBody: document.getElementById("releases-table-body"),
  },

  /**
   * Initialize UI event listeners
   * @param {Function} fetchStatsCallback - Callback function to fetch repository stats
   */
  init(fetchStatsCallback) {
    this.elements.getStatsBtn.addEventListener("click", fetchStatsCallback);
    this.elements.repoUrlInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        fetchStatsCallback();
      }
    });
  },

  /**
   * Show a status message
   * @param {HTMLElement} element - Element to display the status in
   * @param {string} message - Message to display
   * @param {string} type - Type of status (success or error)
   */
  showStatus(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `status ${type}`;
    setTimeout(() => {
      element.className = "status";
    }, 3000);
  },

  /**
   * Toggle loading indicator
   * @param {boolean} show - Whether to show or hide the loading indicator
   */
  showLoading(show) {
    this.elements.loadingIndicator.classList.toggle("hidden", !show);
  },

  /**
   * Toggle error container and update error message
   * @param {boolean} show - Whether to show or hide the error
   * @param {string} message - Error message to display
   */
  showError(show, message = "Error fetching repository data.") {
    this.elements.errorContainer.classList.toggle("hidden", !show);
    this.elements.errorMessage.textContent = message;
  },

  /**
   * Toggle results container visibility
   * @param {boolean} show - Whether to show or hide the results
   */
  showResults(show) {
    this.elements.resultsContainer.classList.toggle("hidden", !show);
  },

  /**
   * Render the releases table
   * @param {Array} releases - Array of release objects
   */
  renderReleasesTable(releases) {
    const tableBody = this.elements.releasesTableBody;
    tableBody.innerHTML = "";

    if (releases.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5;
      cell.textContent = "No releases found";
      cell.style.textAlign = "center";
      row.appendChild(cell);
      tableBody.appendChild(row);
      return;
    }

    // Sort releases by published date (newest first)
    const sortedReleases = [...releases].sort(
      (a, b) => new Date(b.published_at) - new Date(a.published_at)
    );

    sortedReleases.forEach((release) => {
      const row = document.createElement("tr");

      // Version column
      const versionCell = document.createElement("td");
      versionCell.textContent = release.tag_name;
      row.appendChild(versionCell);

      // Release date column
      const dateCell = document.createElement("td");
      dateCell.textContent = Utils.formatDate(release.published_at);
      row.appendChild(dateCell);

      // Assets column
      const assetsCell = document.createElement("td");
      assetsCell.textContent = release.assets.length;
      row.appendChild(assetsCell);

      // Pre-release column
      const preReleaseCell = document.createElement("td");
      const releaseTag = document.createElement("span");
      if (release.prerelease) {
        releaseTag.className = "pre-release-tag";
        releaseTag.textContent = "Pre-release";
      } else {
        releaseTag.className = "stable-tag";
        releaseTag.textContent = "Stable";
      }
      preReleaseCell.appendChild(releaseTag);
      row.appendChild(preReleaseCell);

      // Downloads column
      const downloadsCell = document.createElement("td");
      const totalDownloads = release.assets.reduce(
        (sum, asset) => sum + asset.download_count,
        0
      );
      downloadsCell.textContent = totalDownloads.toLocaleString();
      row.appendChild(downloadsCell);

      tableBody.appendChild(row);
    });
  },

  /**
   * Update UI with repository info
   * @param {Object} repoInfo - Repository information object
   * @param {Array} releases - Array of release objects
   * @param {string} username - GitHub username
   * @param {string} repoName - Repository name
   */
  updateRepositoryInfo(repoInfo, releases, username, repoName) {
    this.elements.repoName.textContent = repoInfo.name;
    this.elements.repoFullName.textContent = `${username}/${repoName}`;
    this.elements.repoDescription.textContent =
      repoInfo.description || "No description available";
    this.elements.totalReleases.textContent = releases.length;
    this.elements.latestVersion.textContent =
      releases.length > 0 ? releases[0].tag_name : "N/A";
    this.elements.totalAssets.textContent = Utils.countTotalAssets(releases);
    this.elements.releaseFrequency.textContent =
      Utils.calculateReleaseFrequency(releases);
    this.elements.totalDownloads.textContent =
      Utils.calculateTotalDownloads(releases).toLocaleString();
    this.elements.avgDownloads.textContent =
      Utils.calculateAverageDownloads(releases);

    // Render table
    this.renderReleasesTable(releases);
  },
};

export default UI;
