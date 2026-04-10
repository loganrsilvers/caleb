// Filter gallery by category
function filterGallery(category) {
    const images = document.querySelectorAll('.gallery-image');
    
    images.forEach(img => {
        if (category === 'all' || img.dataset.category === category) {
            img.classList.remove('hidden');
        } else {
            img.classList.add('hidden');
        }
    });
}

// Add event listeners to filter buttons (you'll need to add these buttons)
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.filter;
        filterGallery(category);
    });
});

// Default: show all
filterGallery('all');







document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery-grid");
  const images = gallery.querySelectorAll(".gallery-image");

  images.forEach(img => {
    // Wait for each image to load before measuring
    img.addEventListener("load", () => {
      const rowHeight = parseInt(window.getComputedStyle(gallery).getPropertyValue("grid-auto-rows"));
      const rowGap = parseInt(window.getComputedStyle(gallery).getPropertyValue("gap"));
      const rowSpan = Math.ceil((img.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
      img.style.gridRowEnd = `span ${rowSpan}`;
    });

    // Handle cached images that might already be loaded
    if (img.complete) {
      img.dispatchEvent(new Event("load"));
    }
  });

  // Optional: adjust on window resize
  window.addEventListener("resize", () => {
    images.forEach(img => {
      const rowHeight = parseInt(window.getComputedStyle(gallery).getPropertyValue("grid-auto-rows"));
      const rowGap = parseInt(window.getComputedStyle(gallery).getPropertyValue("gap"));
      const rowSpan = Math.ceil((img.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
      img.style.gridRowEnd = `span ${rowSpan}`;
    });
  });
});