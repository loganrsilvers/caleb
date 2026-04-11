document.addEventListener("DOMContentLoaded", () => {

  const gallery = document.querySelector(".gallery-grid");

  function setSpan(el) {
    const rowHeight = parseInt(getComputedStyle(gallery).getPropertyValue("grid-auto-rows"));
    const rowGap    = parseInt(getComputedStyle(gallery).getPropertyValue("gap"));
    const height    = el.getBoundingClientRect().height;
    if (height === 0) return; // skip until element has real height
    const span = Math.ceil((height + rowGap) / (rowHeight + rowGap));
    el.style.gridRowEnd = `span ${span}`;
  }

  function recalcAll() {
    gallery.querySelectorAll(".gallery-image:not(.shutter-image)").forEach(el => setSpan(el));
    gallery.querySelectorAll(".shutter-group").forEach(el => setSpan(el));
  }

  // Run on each image load
  gallery.querySelectorAll(".gallery-image:not(.shutter-image)").forEach(img => {
    img.addEventListener("load", () => setSpan(img));
    if (img.complete) setSpan(img);
  });

  // Run on first image load inside each shutter group
  gallery.querySelectorAll(".shutter-group").forEach(group => {
    const first = group.querySelector(".shutter-image");
    if (!first) return;
    first.addEventListener("load", () => setSpan(group));
    if (first.complete) setSpan(group);
  });

  // Belt-and-suspenders: recalc after full page load and after a short delay
  window.addEventListener("load", () => {
    recalcAll();
    setTimeout(recalcAll, 300); // catches any late-rendering images
  });

  window.addEventListener("resize", recalcAll);

  // --- Filter ---
  function filterGallery(category) {
    gallery.querySelectorAll(".gallery-image:not(.shutter-image)").forEach(img => {
      const match = category === "all" || img.dataset.category === category;
      img.classList.toggle("hidden", !match);
    });

    gallery.querySelectorAll(".shutter-group").forEach(group => {
      const match = category === "all" || group.dataset.category === category;
      group.classList.toggle("hidden", !match);
      // Recalc spans after filter since layout shifts
      if (!match === false) setTimeout(() => setSpan(group), 50);
    });

    // Recalc masonry after any filter change
    setTimeout(recalcAll, 100);
  }

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => filterGallery(btn.dataset.filter));
  });

  filterGallery("all");
});