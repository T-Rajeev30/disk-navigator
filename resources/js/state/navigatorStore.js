const NavigatorStore = {
  currentPath: "",
  contents: [],
  history: [],
  searchQuery: "",

  setPath(path) {
    if (this.currentPath) {
      this.history.push(this.currentPath);
    }
    this.currentPath = path;
    this.searchQuery = "";
  },

  goBack() {
    if (this.history.length === 0) return null;
    this.currentPath = this.history.pop();
    this.searchQuery = "";
    return this.currentPath;
  },

  setContents(contents) {
    // Filter out . and .. entries
    this.contents = contents.filter(
      (item) => item.entry !== "." && item.entry !== "..",
    );
  },

  getFilteredContents() {
    if (!this.searchQuery) return this.contents;
    const q = this.searchQuery.toLowerCase();
    return this.contents.filter((item) => item.entry.toLowerCase().includes(q));
  },

  setSearchQuery(query) {
    this.searchQuery = query;
  },

  getBreadcrumbs() {
    if (!this.currentPath) return [];
    // Normalize slashes
    const normalized = this.currentPath.replace(/\\/g, "/");
    const parts = normalized.split("/").filter(Boolean);
    const crumbs = [];

    if (NL_OS === "Windows") {
      let accumulated = parts[0] + "\\";
      crumbs.push({ label: parts[0], path: accumulated });
      for (let i = 1; i < parts.length; i++) {
        accumulated += parts[i] + "\\";
        crumbs.push({ label: parts[i], path: accumulated });
      }
    } else {
      let accumulated = "/";
      crumbs.push({ label: "/", path: "/" });
      for (let i = 0; i < parts.length; i++) {
        accumulated += parts[i] + "/";
        crumbs.push({ label: parts[i], path: accumulated });
      }
    }
    return crumbs;
  },
};
