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
};

export default Utils;
