const Sidebar = {
  async render() {
    const container = document.getElementById("drives-list");
    container.innerHTML = '<div class="loading">Detecting drives...</div>';

    const drives = await OsService.getRoots();

    if (drives.length === 0) {
      container.innerHTML = '<div class="empty-state">No drives found</div>';
      return;
    }

    container.innerHTML = drives
      .map(
        (drive) => `
      <div class="drive-item" data-path="${drive.path}">
        <span class="drive-icon">💾</span>
        <span class="drive-label">${drive.label}</span>
      </div>
    `,
      )
      .join("");

    container.querySelectorAll(".drive-item").forEach((el) => {
      el.addEventListener("click", async () => {
        // Highlight active drive
        container
          .querySelectorAll(".drive-item")
          .forEach((d) => d.classList.remove("active"));
        el.classList.add("active");
        await Navigator.navigateTo(el.dataset.path);
      });
    });
  },
};
