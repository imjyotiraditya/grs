/**
 * UI management module for GitHub Release Stats
 * Handles all DOM interactions and UI updates
 */

import Utils from "./utils.js";

const UI = {
  elements: {
    // Input elements
    repoUrlInput: document.getElementById("repo-input"),
    getStatsBtn: document.getElementById("analyze-btn"),

    // Status and container elements
    repoStatus: document.getElementById("status-msg"),
    resultsContainer: document.getElementById("results"),
    loadingIndicator: document.getElementById("loading"),
    errorContainer: document.getElementById("error"),
    errorMessage: document.getElementById("error-text"),

    // Repository info elements
    repoName: document.getElementById("repo-name"),
    repoDescription: document.getElementById("repo-desc"),
    totalReleases: document.getElementById("stat-releases"),
    latestVersion: document.getElementById("stat-latest"),
    totalAssets: document.getElementById("stat-assets"),
    releaseFrequency: document.getElementById("stat-frequency"),
    totalDownloads: document.getElementById("stat-downloads"),
    avgDownloads: document.getElementById("stat-avg"),
    releasesTableBody: document.getElementById("releases-body"),

    // Share button element
    shareButton: document.getElementById("share-btn"),

    // Releases count element
    releasesCount: document.getElementById("releases-count"),

    // Retry button element
    retryBtn: document.getElementById("retry-btn"),
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

    // Add event listener for share button
    this.elements.shareButton.addEventListener(
      "click",
      this.handleShareButtonClick.bind(this),
    );

    // Add event listener for retry button
    this.elements.retryBtn.addEventListener("click", fetchStatsCallback);
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
    element.className = `status-msg ${type}`;
    setTimeout(() => {
      element.className = "status-msg";
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
   * Handle share button click
   */
  handleShareButtonClick() {
    const repoUrl = this.elements.repoUrlInput.value.trim();
    if (!repoUrl) return;

    // Create the shareable URL with the 'r' parameter
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("r", repoUrl);
    const shareableUrl = currentUrl.toString();

    // Copy to clipboard
    navigator.clipboard
      .writeText(shareableUrl)
      .then(() => {
        this.showToast("LINK COPIED TO CLIPBOARD!");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        this.showToast("FAILED TO COPY LINK");
      });
  },

  /**
   * Show a toast notification
   * @param {string} message - Message to display in the toast
   */
  showToast(message) {
    // Remove any existing toast
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
      existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show the toast
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    // Hide the toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  },

  /**
   * Create asset details row for a release
   * @param {Object} release - Release object containing assets
   * @param {number} colspan - Number of columns to span
   * @returns {HTMLElement} TR element with asset details
   */
  createAssetDetailsRow(release, colspan) {
    const detailsRow = document.createElement("tr");
    detailsRow.className = "asset-row";
    detailsRow.dataset.assetRow = release.id;

    const detailsCell = document.createElement("td");
    detailsCell.colSpan = colspan;
    detailsCell.className = "asset-details";

    // Create asset details container
    const detailsContainer = document.createElement("div");
    detailsContainer.className = "asset-list";

    if (release.assets.length === 0) {
      // No assets message
      const noAssetsMsg = document.createElement("div");
      noAssetsMsg.className = "no-assets";
      noAssetsMsg.textContent = "NO ASSETS AVAILABLE";
      detailsContainer.appendChild(noAssetsMsg);
    } else {
      // Create asset items
      release.assets.forEach((asset, index) => {
        const assetItem = document.createElement("div");
        assetItem.className = "asset-item";

        // Asset number
        const numDiv = document.createElement("div");
        numDiv.className = "asset-num";
        numDiv.textContent = index + 1;
        assetItem.appendChild(numDiv);

        // Asset name with download link
        const nameDiv = document.createElement("div");
        nameDiv.className = "asset-name";
        const nameLink = document.createElement("a");
        nameLink.href = asset.browser_download_url;
        nameLink.textContent = asset.name;
        nameLink.target = "_blank";
        nameLink.rel = "noopener noreferrer";
        nameDiv.appendChild(nameLink);
        assetItem.appendChild(nameDiv);

        // Asset size
        const sizeDiv = document.createElement("div");
        sizeDiv.textContent = Utils.formatFileSize(asset.size);
        assetItem.appendChild(sizeDiv);

        // Download count with icon
        const downloadDiv = document.createElement("div");
        downloadDiv.innerHTML = `${Utils.formatNumber(
          asset.download_count,
        )} <i class="fas fa-download"></i>`;
        assetItem.appendChild(downloadDiv);

        // Created at
        const createdDiv = document.createElement("div");
        createdDiv.textContent = Utils.formatDate(asset.created_at);
        assetItem.appendChild(createdDiv);

        detailsContainer.appendChild(assetItem);
      });
    }

    detailsCell.appendChild(detailsContainer);
    detailsRow.appendChild(detailsCell);

    return detailsRow;
  },

  /**
   * Handle click on a release row
   * @param {Event} event - Click event
   * @param {Object} release - Release object
   */
  handleReleaseRowClick(event, release) {
    const row = event.currentTarget;
    const existingDetailsRow = row.nextElementSibling;
    const isDetailsRow =
      existingDetailsRow && existingDetailsRow.classList.contains("asset-row");

    // Remove any existing open asset details
    const allDetailRows = document.querySelectorAll(".asset-row");
    allDetailRows.forEach((detailRow) => detailRow.remove());

    // Remove active class from all rows
    const allRows = document.querySelectorAll(
      ".releases-table tbody tr:not(.asset-row)",
    );
    allRows.forEach((r) => r.classList.remove("active"));

    // If details were already open for this row, just close them (already removed above)
    // Otherwise, open details for this row
    if (
      !isDetailsRow ||
      existingDetailsRow.dataset.assetRow !== release.id.toString()
    ) {
      row.classList.add("active");
      const detailsRow = this.createAssetDetailsRow(release, 6); // 6 columns in the table
      row.parentNode.insertBefore(detailsRow, row.nextSibling);
    }
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
      cell.colSpan = 6;
      cell.textContent = "No releases found";
      cell.style.textAlign = "center";
      row.appendChild(cell);
      tableBody.appendChild(row);
      return;
    }

    // Sort releases by published date (newest first)
    const sortedReleases = [...releases].sort(
      (a, b) => new Date(b.published_at) - new Date(a.published_at),
    );

    sortedReleases.forEach((release) => {
      const row = document.createElement("tr");
      row.dataset.releaseId = release.id;

      // Make the row clickable
      row.addEventListener("click", (event) =>
        this.handleReleaseRowClick(event, release),
      );

      // Version column
      const versionCell = document.createElement("td");
      versionCell.className = "release-version";
      versionCell.textContent = release.tag_name;
      row.appendChild(versionCell);

      // Release date column
      const dateCell = document.createElement("td");
      dateCell.textContent = Utils.formatDate(release.published_at);
      row.appendChild(dateCell);

      // Status column
      const statusCell = document.createElement("td");
      const releaseTag = document.createElement("span");
      if (release.prerelease) {
        releaseTag.className = "release-tag tag-pre";
        releaseTag.textContent = "PRE";
      } else {
        releaseTag.className = "release-tag tag-stable";
        releaseTag.textContent = "STABLE";
      }
      statusCell.appendChild(releaseTag);
      row.appendChild(statusCell);

      // Assets column
      const assetsCell = document.createElement("td");
      assetsCell.textContent = release.assets.length;
      row.appendChild(assetsCell);

      // Downloads column
      const downloadsCell = document.createElement("td");
      const totalDownloads = release.assets.reduce(
        (sum, asset) => sum + asset.download_count,
        0,
      );
      downloadsCell.textContent = Utils.formatNumber(totalDownloads);
      row.appendChild(downloadsCell);

      // Expand button column
      const expandCell = document.createElement("td");
      const expandBtn = document.createElement("button");
      expandBtn.className = "btn-expand";
      expandBtn.textContent = "+";
      expandBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleReleaseRowClick({ currentTarget: row }, release);
      });
      expandCell.appendChild(expandBtn);
      row.appendChild(expandCell);

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
    this.elements.repoDescription.textContent =
      repoInfo.description || "No description available";
    this.elements.totalReleases.textContent = Utils.formatNumber(
      releases.length,
    );
    this.elements.latestVersion.textContent =
      releases.length > 0 ? releases[0].tag_name : "N/A";
    this.elements.totalAssets.textContent = Utils.formatNumber(
      Utils.countTotalAssets(releases),
    );
    this.elements.releaseFrequency.textContent =
      Utils.calculateReleaseFrequency(releases);
    this.elements.totalDownloads.textContent = Utils.formatNumber(
      Utils.calculateTotalDownloads(releases),
    );
    this.elements.avgDownloads.textContent = Utils.formatNumber(
      Math.round(
        releases.length > 0
          ? Utils.calculateTotalDownloads(releases) / releases.length
          : 0,
      ),
    );

    // Update releases count
    this.elements.releasesCount.textContent = releases.length;

    // Render table
    this.renderReleasesTable(releases);
  },
};

export default UI;
