/**
 * Utility functions for GitHub Release Stats
 */

const Utils = {
  /**
   * Format a date string to a readable format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  /**
   * Format file size in a human readable format
   * @param {number} bytes - Size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  /**
   * Format number with thousands separators
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(num) {
    return num.toLocaleString();
  },

  /**
   * Calculate the average frequency between releases
   * @param {Array} releases - Array of release objects
   * @returns {string} Human-readable release frequency
   */
  calculateReleaseFrequency(releases) {
    if (releases.length <= 1) return "N/A";

    const sortedReleases = [...releases].sort(
      (a, b) => new Date(a.published_at) - new Date(b.published_at),
    );

    const firstDate = new Date(sortedReleases[0].published_at);
    const lastDate = new Date(
      sortedReleases[sortedReleases.length - 1].published_at,
    );

    const diffInDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    const averageDays = diffInDays / (sortedReleases.length - 1);

    if (averageDays < 1) {
      return "DAILY";
    } else if (averageDays < 7) {
      const days = Math.round(averageDays);
      return days + "D";
    } else if (averageDays < 30) {
      const weeks = Math.round(averageDays / 7);
      return weeks + "W";
    } else if (averageDays < 365) {
      const months = Math.round(averageDays / 30);
      return months + "M";
    } else {
      const years = (averageDays / 365).toFixed(1);
      return years + "Y";
    }
  },

  /**
   * Count the total number of assets across all releases
   * @param {Array} releases - Array of release objects
   * @returns {number} Total number of assets
   */
  countTotalAssets(releases) {
    return releases.reduce(
      (total, release) => total + release.assets.length,
      0,
    );
  },

  /**
   * Calculate the total number of downloads across all releases
   * @param {Array} releases - Array of release objects
   * @returns {number} Total number of downloads
   */
  calculateTotalDownloads(releases) {
    return releases.reduce((total, release) => {
      const releaseDownloads = release.assets.reduce(
        (sum, asset) => sum + asset.download_count,
        0,
      );
      return total + releaseDownloads;
    }, 0);
  },
};

export default Utils;
