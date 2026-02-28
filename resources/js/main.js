const Navigator = {
  async init() {
    Neutralino.init();
    Neutralino.events.on("windowClose", () => Neutralino.app.exit());

    // Render sidebar drives
    await Sidebar.render();

    // Navigate to home directory on startup
    const home = await OsService.getHomeDirectory();
    if (home.success) {
      await this.navigateTo(home.data);
    }

    // Search box listener
    document.getElementById("search-box").addEventListener("input", (e) => {
      NavigatorStore.setSearchQuery(e.target.value);
      FileList.render();
    });

    // Home button
    document.getElementById("btn-home").addEventListener("click", async () => {
      const home = await OsService.getHomeDirectory();
      if (home.success) await this.navigateTo(home.data);
    });

    // Copy current path button
    document
      .getElementById("btn-copy-path")
      .addEventListener("click", async () => {
        if (NavigatorStore.currentPath) {
          const result = await ClipboardService.copyPath(
            NavigatorStore.currentPath,
          );
          if (result.success) this.showToast("Current path copied");
        }
      });
  },

  async navigateTo(path) {
    const result = await FilesystemService.readDirectory(path);

    if (!result.success) {
      this.showToast(`Error: ${result.error}`, true);
      return;
    }

    NavigatorStore.setPath(path);
    NavigatorStore.setContents(result.data);

    // Clear search on navigation
    document.getElementById("search-box").value = "";

    Breadcrumb.render();
    FileList.render();
  },

  showToast(message, isError = false) {
    const existing = document.getElementById("toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "toast";
    toast.className = isError ? "toast toast-error" : "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2500);
  },
};

Navigator.init();
