function enableShutterGroups(gridSelector, imageSelector) {
  const grid = document.querySelector(gridSelector);
  if (!grid) return;

  const groups = {};

  // Collect groups, remembering the first image's position in the DOM
  grid.querySelectorAll(`${imageSelector}[data-shutter-group]`).forEach(img => {
    const groupKey = img.getAttribute('data-shutter-group');
    if (!groups[groupKey]) {
      groups[groupKey] = {
        images: [],
        // Save the reference BEFORE any DOM moves happen
        placeholder: document.createComment(`shutter-group:${groupKey}`)
      };
      // Insert a comment node as a stable anchor right before the first image
      img.parentNode.insertBefore(groups[groupKey].placeholder, img);
    }
    groups[groupKey].images.push(img);
  });

    Object.values(groups).forEach(({ images, placeholder }) => {
        const container = document.createElement('div');
        container.className = 'shutter-group';

        const category = images[0].getAttribute('data-category');
        if (category) container.setAttribute('data-category', category);

        const delayStep = 0.3;
        // Each image gets its window, total cycle = count × step
        const duration = images.length * delayStep;

        images.forEach((img, index) => {
        // inside the forEach where you set animationDelay:
          img.classList.add('shutter-image');
          img.style.animationDelay    = `${index * delayStep}s`;
          img.style.animationDuration = `${duration}s`;
          img.style.willChange        = 'opacity, transform'; // GPU layer for animation
          container.appendChild(img);
        });

        placeholder.parentNode.insertBefore(container, placeholder);
        placeholder.remove();
    });
}

enableShutterGroups('#section-gallery', '.gallery-image');