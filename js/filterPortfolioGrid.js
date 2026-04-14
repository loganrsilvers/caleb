document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery-grid");
  let rowHeight, rowGap;

  function cacheGridStyle() {
    const style = getComputedStyle(gallery);
    rowHeight = parseInt(style.getPropertyValue("grid-auto-rows"));
    rowGap    = parseInt(style.getPropertyValue("gap"));
  }

  function setSpan(el) {
    const height = el.getBoundingClientRect().height;
    if (height === 0) return;
    el.style.gridRowEnd = `span ${Math.ceil((height + rowGap) / (rowHeight + rowGap))}`;
  }

  function recalcAll() {
    cacheGridStyle(); // read once per pass, not once per element
    gallery.querySelectorAll(".gallery-image:not(.shutter-image)").forEach(setSpan);
    gallery.querySelectorAll(".shutter-group").forEach(setSpan);
  }

  // ResizeObserver fires when an image's box actually changes — no blind timeouts
  const ro = new ResizeObserver(() => recalcAll());
  gallery.querySelectorAll(".gallery-image:not(.shutter-image), .shutter-group").forEach(el => {
    ro.observe(el);
  });

  // Initial spans on image load
  gallery.querySelectorAll(".gallery-image:not(.shutter-image)").forEach(img => {
    if (img.complete) setSpan(img);
    else img.addEventListener("load", () => setSpan(img), { once: true });
  });

  gallery.querySelectorAll(".shutter-group").forEach(group => {
    const first = group.querySelector(".shutter-image");
    if (!first) return;
    if (first.complete) setSpan(group);
    else first.addEventListener("load", () => setSpan(group), { once: true });
  });

  // Debounced resize (fires once after user stops resizing, not on every pixel)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(recalcAll, 150);
  });

  window.addEventListener("load", recalcAll, { once: true });

  // --- Filter ---
  function filterGallery(category) {
    gallery.querySelectorAll(".gallery-image:not(.shutter-image)").forEach(img => {
      img.classList.toggle("hidden", category !== "all" && img.dataset.category !== category);
    });
    gallery.querySelectorAll(".shutter-group").forEach(group => {
      group.classList.toggle("hidden", category !== "all" && group.dataset.category !== category);
    });
    // One recalc after all DOM changes are done
    requestAnimationFrame(recalcAll);
  }

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => filterGallery(btn.dataset.filter));
  });

  filterGallery("all");
});