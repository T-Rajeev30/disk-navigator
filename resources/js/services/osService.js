const OsService = {
  async getHomeDirectory() {
    try {
      const key = NL_OS === "Windows" ? "USERPROFILE" : "HOME";
      const home = await Neutralino.os.getEnv(key);
      return { success: true, data: home };
    } catch (err) {
      return { success: false, error: "Unable to get home directory" };
    }
  },

  async getRoots() {
    if (NL_OS === "Windows") {
      // Check common Windows drive letters
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      const drives = [];
      for (const letter of letters) {
        try {
          await Neutralino.filesystem.getStats(`${letter}:\\`);
          drives.push({ label: `${letter}:`, path: `${letter}:\\` });
        } catch (err) {
          // Drive doesn't exist, skip
        }
      }
      return drives;
    } else {
      // Linux/Mac — root is just /
      return [{ label: "/ (Root)", path: "/" }];
    }
  },

  async openFile(path) {
    try {
      await Neutralino.os.open(path);
      return { success: true };
    } catch (err) {
      return { success: false, error: "Unable to open file" };
    }
  },

  getPlatform() {
    return NL_OS;
  },
};
