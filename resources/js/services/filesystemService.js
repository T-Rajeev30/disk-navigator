const FilesystemService = {
  async readDirectory(path) {
    try {
      const contents = await Neutralino.filesystem.readDirectory(path);
      return { success: true, data: contents };
    } catch (err) {
      if (err.code === "NE_FS_NOPATHE")
        return { success: false, error: "Path does not exist" };
      if (err.code === "NE_RT_NATPRME")
        return { success: false, error: "Permission denied" };
      return { success: false, error: "Unable to read directory" };
    }
  },

  async getStats(path) {
    try {
      const stats = await Neutralino.filesystem.getStats(path);
      return { success: true, data: stats };
    } catch (err) {
      return { success: false, error: "Unable to get file stats" };
    }
  },

  formatSize(bytes) {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  },

  formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },
};
