// DOM Elements
const repoUrlInput = document.getElementById("repo-url");
const getStatsBtn = document.getElementById("get-stats");
const repoStatus = document.getElementById("repo-status");
const resultsContainer = document.getElementById("results-container");
const loadingIndicator = document.getElementById("loading-indicator");
const errorContainer = document.getElementById("error-container");
const errorMessage = document.getElementById("error-message");

// Repository info elements
const repoName = document.getElementById("repo-name");
const repoDescription = document.getElementById("repo-description");
const totalReleases = document.getElementById("total-releases");
const latestVersion = document.getElementById("latest-version");
const totalAssets = document.getElementById("total-assets");
const releaseFrequency = document.getElementById("release-frequency");
const releasesTableBody = document.getElementById("releases-table-body");

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  getStatsBtn.addEventListener("click", fetchRepositoryStats);
  repoUrlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      fetchRepositoryStats();
    }
  });
});

// Functions
function toggleStatsSection() {
  const content = document.querySelector(".settings-content");
  const icon = document.querySelector(".toggle-icon");
  const header = document.querySelector(".settings-header");
  const isCollapsed = content.classList.contains("collapsed");

  content.classList.toggle("collapsed");
  icon.classList.toggle("collapsed");

  header.setAttribute("aria-expanded", isCollapsed ? "true" : "false");
  content.setAttribute("aria-hidden", isCollapsed ? "false" : "true");
}

function showStatus(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = `status ${type}`;
  setTimeout(() => {
    element.className = "status";
  }, 3000);
}

function showLoading(show) {
  loadingIndicator.classList.toggle("hidden", !show);
}

function showError(show, message = "Error fetching repository data.") {
  errorContainer.classList.toggle("hidden", !show);
  errorMessage.textContent = message;
}

function showResults(show) {
  resultsContainer.classList.toggle("hidden", !show);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function calculateReleaseFrequency(releases) {
  if (releases.length <= 1) return "N/A";

  const sortedReleases = [...releases].sort(
    (a, b) => new Date(a.published_at) - new Date(b.published_at)
  );

  const firstDate = new Date(sortedReleases[0].published_at);
  const lastDate = new Date(
    sortedReleases[sortedReleases.length - 1].published_at
  );

  const diffInDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
  const averageDays = diffInDays / (sortedReleases.length - 1);

  if (averageDays < 1) {
    return "Multiple per day";
  } else if (averageDays < 7) {
    const days = Math.round(averageDays);
    return days + (days === 1 ? " day" : " days");
  } else if (averageDays < 30) {
    const weeks = Math.round(averageDays / 7);
    return weeks + (weeks === 1 ? " week" : " weeks");
  } else if (averageDays < 365) {
    const months = Math.round(averageDays / 30);
    return months + (months === 1 ? " month" : " months");
  } else {
    const years = Math.round(averageDays / 365);
    return years + (years === 1 ? " year" : " years");
  }
}

function countTotalAssets(releases) {
  return releases.reduce((total, release) => total + release.assets.length, 0);
}

function renderReleasesTable(releases) {
  releasesTableBody.innerHTML = "";

  if (releases.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = "No releases found";
    cell.style.textAlign = "center";
    row.appendChild(cell);
    releasesTableBody.appendChild(row);
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
    dateCell.textContent = formatDate(release.published_at);
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

    releasesTableBody.appendChild(row);
  });
}

function parseGitHubUrl(url) {
  try {
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
}

async function fetchRepositoryStats() {
  const repoUrl = repoUrlInput.value.trim();
  if (!repoUrl) {
    showStatus(repoStatus, "Please enter a GitHub repository URL", "error");
    return;
  }

  try {
    // Reset UI state
    showResults(false);
    showError(false);
    showLoading(true);

    // Parse GitHub URL
    const { username, repoName } = parseGitHubUrl(repoUrl);

    // Fetch repository info
    const repoInfoResponse = await fetch(
      `https://api.github.com/repos/${username}/${repoName}`
    );
    if (!repoInfoResponse.ok) {
      throw new Error(`Repository not found: ${username}/${repoName}`);
    }
    const repoInfo = await repoInfoResponse.json();

    // Fetch repository releases
    const releasesResponse = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/releases`
    );
    if (!releasesResponse.ok) {
      throw new Error("Failed to fetch repository releases");
    }
    const releases = await releasesResponse.json();

    // Update UI with repository stats
    repoName.textContent = repoInfo.name;
    repoDescription.textContent =
      repoInfo.description || "No description available";
    totalReleases.textContent = releases.length;
    latestVersion.textContent =
      releases.length > 0 ? releases[0].tag_name : "N/A";
    totalAssets.textContent = countTotalAssets(releases);
    releaseFrequency.textContent = calculateReleaseFrequency(releases);

    // Render table
    renderReleasesTable(releases);

    // Show results
    showLoading(false);
    showResults(true);
  } catch (error) {
    console.error("Error:", error);
    showLoading(false);
    showError(true, error.message);
  }
}
