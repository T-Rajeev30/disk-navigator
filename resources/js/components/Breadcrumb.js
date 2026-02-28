const Breadcrumb = {
  render() {
    const crumbs = NavigatorStore.getBreadcrumbs();
    const container = document.getElementById("breadcrumb");

    if (crumbs.length === 0) {
      container.innerHTML =
        '<span class="crumb-empty">No location selected</span>';
      return;
    }

    container.innerHTML = crumbs
      .map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        if (isLast) {
          return `<span class="crumb-current">${crumb.label}</span>`;
        }
        return `<span class="crumb-link" data-path="${crumb.path}">${crumb.label}</span>
              <span class="crumb-separator">›</span>`;
      })
      .join("");

    // Attach click listeners
    container.querySelectorAll(".crumb-link").forEach((el) => {
      el.addEventListener("click", async () => {
        await Navigator.navigateTo(el.dataset.path);
      });
    });
  },
};
