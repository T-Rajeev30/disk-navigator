const ClipboardService = {
  async copyText(text) {
    try {
      await Neutralino.clipboard.writeText(text);
      return { success: true };
    } catch (err) {
      return { success: false, error: "Unable to copy to clipboard" };
    }
  },

  async copyPath(path) {
    return await this.copyText(path);
  },

  async copyMetadata(entry, stats) {
    const metadata = `
Name: ${entry.entry}
Path: ${entry.path}
Type: ${entry.type}
Size: ${stats ? FilesystemService.formatSize(stats.size) : "N/A"}
Modified: ${stats ? FilesystemService.formatDate(stats.modifiedAt) : "N/A"}
    `.trim();
    return await this.copyText(metadata);
  },
};
