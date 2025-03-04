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
    repoDescription: document.getElementById("repo-description"),
    totalReleases: document.getElementById("total-releases"),
    latestVersion: document.getElementById("latest-version"),
    totalAssets: document.getElementById("total-assets"),
    releaseFrequency: document.getElementById("release-frequency"),
    totalDownloads: document.getElementById("total-downloads"),
    avgDownloads: document.getElementById("avg-downloads"),
    releasesTableBody: document.getElementById("releases-table-body"),

    // Share button element
    shareButton: document.getElementById("share-button"),
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
      this.handleShareButtonClick.bind(this)
    );
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
        this.showToast("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        this.showToast("Failed to copy link.");
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
    detailsRow.className = "asset-details-row";

    const detailsCell = document.createElement("td");
    detailsCell.colSpan = colspan;
    detailsCell.className = "asset-details-cell";

    // Create asset details container
    const detailsContainer = document.createElement("div");
    detailsContainer.className = "asset-details-container";

    if (release.assets.length === 0) {
      // No assets message
      const noAssetsMsg = document.createElement("p");
      noAssetsMsg.className = "no-assets-message";
      noAssetsMsg.textContent = "No assets available for this release";
      detailsContainer.appendChild(noAssetsMsg);
    } else {
      // Create asset details table
      const assetsTable = document.createElement("table");
      assetsTable.className = "assets-table";

      // Table header
      const tableHeader = document.createElement("thead");
      const headerRow = document.createElement("tr");

      ["#", "Asset Name", "Size", "Downloads", "Created At"].forEach(
        (headerText) => {
          const th = document.createElement("th");
          th.textContent = headerText;
          headerRow.appendChild(th);
        }
      );

      tableHeader.appendChild(headerRow);
      assetsTable.appendChild(tableHeader);

      // Table body
      const tableBody = document.createElement("tbody");

      release.assets.forEach((asset, index) => {
        const assetRow = document.createElement("tr");

        // Asset number column
        const numberCell = document.createElement("td");
        numberCell.textContent = (index + 1).toString();
        numberCell.className = "asset-number";
        assetRow.appendChild(numberCell);

        // Asset name with download link
        const nameCell = document.createElement("td");
        const nameLink = document.createElement("a");
        nameLink.href = asset.browser_download_url;
        nameLink.textContent = asset.name;
        nameLink.target = "_blank";
        nameLink.rel = "noopener noreferrer";
        nameCell.appendChild(nameLink);
        assetRow.appendChild(nameCell);

        // Asset size
        const sizeCell = document.createElement("td");
        sizeCell.textContent = Utils.formatFileSize(asset.size);
        assetRow.appendChild(sizeCell);

        // Download count
        const downloadCell = document.createElement("td");
        downloadCell.textContent = asset.download_count.toLocaleString();
        assetRow.appendChild(downloadCell);

        // Created at
        const createdCell = document.createElement("td");
        createdCell.textContent = Utils.formatDate(asset.created_at);
        createdCell.className = "created-at";
        assetRow.appendChild(createdCell);

        tableBody.appendChild(assetRow);
      });

      assetsTable.appendChild(tableBody);
      detailsContainer.appendChild(assetsTable);
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
      existingDetailsRow &&
      existingDetailsRow.classList.contains("asset-details-row");

    // Remove any existing open asset details
    const allDetailRows = document.querySelectorAll(".asset-details-row");
    allDetailRows.forEach((detailRow) => detailRow.remove());

    // Remove active class from all rows
    const allRows = document.querySelectorAll(
      ".releases-table tbody tr:not(.asset-details-row)"
    );
    allRows.forEach((r) => r.classList.remove("active-release-row"));

    // If details were already open for this row, just close them (already removed above)
    // Otherwise, open details for this row
    if (
      !isDetailsRow ||
      existingDetailsRow.dataset.releaseId !== release.id.toString()
    ) {
      row.classList.add("active-release-row");
      const detailsRow = this.createAssetDetailsRow(release, 5); // 5 columns in the table
      detailsRow.dataset.releaseId = release.id;
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
      row.className = "release-row";
      row.dataset.releaseId = release.id;

      // Make the row clickable
      row.addEventListener("click", (event) =>
        this.handleReleaseRowClick(event, release)
      );

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
