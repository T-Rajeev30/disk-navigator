const FileList = {
  render() {
    const contents = NavigatorStore.getFilteredContents();
    const container = document.getElementById("file-list");
    const statusBar = document.getElementById("status-bar");

    if (contents.length === 0) {
      container.innerHTML = '<div class="empty-state">No files found</div>';
      statusBar.textContent = "0 items";
      return;
    }

    // Sort: directories first, then files
    const sorted = [...contents].sort((a, b) => {
      if (a.type === b.type) return a.entry.localeCompare(b.entry);
      return a.type === "DIRECTORY" ? -1 : 1;
    });

    container.innerHTML = sorted
      .map((item) => {
        const icon = item.type === "DIRECTORY" ? "📁" : "📄";
        return `
        <div class="file-item ${item.type === "DIRECTORY" ? "is-dir" : "is-file"}"
             data-path="${item.path}"
             data-type="${item.type}"
             data-entry="${item.entry}">
          <span class="file-icon">${icon}</span>
          <span class="file-name">${item.entry}</span>
          <span class="file-actions">
            <button class="btn-copy-path" data-path="${item.path}" title="Copy path">⎘</button>
            <button class="btn-open" data-path="${item.path}" title="Open">↗</button>
          </span>
        </div>
      `;
      })
      .join("");

    // Status bar
    const dirs = sorted.filter((i) => i.type === "DIRECTORY").length;
    const files = sorted.filter((i) => i.type === "FILE").length;
    statusBar.textContent = `${dirs} folders, ${files} files`;

    // Click on item to navigate or open
    container.querySelectorAll(".file-item").forEach((el) => {
      el.addEventListener("click", async (e) => {
        if (e.target.closest("button")) return;
        const path = el.dataset.path;
        const type = el.dataset.type;
        if (type === "DIRECTORY") {
          await Navigator.navigateTo(path);
        } else {
          await OsService.openFile(path);
        }
      });
    });

    // Copy path buttons
    container.querySelectorAll(".btn-copy-path").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const result = await ClipboardService.copyPath(btn.dataset.path);
        if (result.success) Navigator.showToast("Path copied to clipboard");
      });
    });

    // Open buttons
    container.querySelectorAll(".btn-open").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await OsService.openFile(btn.dataset.path);
      });
    });
  },
};
