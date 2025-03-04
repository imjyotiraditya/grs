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
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  /**
   * Calculate the average frequency between releases
   * @param {Array} releases - Array of release objects
   * @returns {string} Human-readable release frequency
   */
  calculateReleaseFrequency(releases) {
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
  },

  /**
   * Count the total number of assets across all releases
   * @param {Array} releases - Array of release objects
   * @returns {number} Total number of assets
   */
  countTotalAssets(releases) {
    return releases.reduce(
      (total, release) => total + release.assets.length,
      0
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
        0
      );
      return total + releaseDownloads;
    }, 0);
  },

  /**
   * Calculate the average downloads per release
   * @param {Array} releases - Array of release objects
   * @returns {string} Average downloads per release, formatted
   */
  calculateAverageDownloads(releases) {
    if (releases.length === 0) return "0";

    const totalDownloads = this.calculateTotalDownloads(releases);
    const averageDownloads = totalDownloads / releases.length;

    // Format to handle decimals nicely
    if (averageDownloads < 1 && averageDownloads > 0) {
      return averageDownloads.toFixed(2);
    }

    return Math.round(averageDownloads).toLocaleString();
  },
};

export default Utils;
