const canvas = document.getElementById('animation-canvas');
const context = canvas.getContext('2d');

const frameCount = 192;
const currentFrame = index => (
  `/imgs/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const images = [];
let loadedImages = 0;

// Preload images for maximum smoothness
const preloadImages = () => {
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
    img.onload = () => {
      loadedImages++;
      // Once the very first image is loaded, draw it
      if (loadedImages === 1) {
        setupCanvas(images[0]);
        // Also run a render pass immediately
        handleScroll();
      }
    };
  }
};

const setupCanvas = (img) => {
  // Set canvas dimensions to match the image dimensions
  canvas.width = img.width;
  canvas.height = img.height;
};

// Update the canvas to show the correct frame
const updateImage = index => {
  if (images[index] && images[index].complete) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[index], 0, 0);
  }
};

// Grab DOM elements
const scrollContainer = document.querySelector('.scroll-container');
const introSection = document.querySelector('.intro-section');
const outroSection = document.querySelector('.outro-section');
const progressBars = document.querySelectorAll('.indicator-progress');

const handleScroll = () => {
  // Calculate scroll fraction
  const scrollTop = document.documentElement.scrollTop;
  const maxScrollTop = scrollContainer.scrollHeight - window.innerHeight;
  const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));

  // Determine which frame to draw
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );
  requestAnimationFrame(() => updateImage(frameIndex));

  // Update Progress Bars on Left/Right
  progressBars.forEach(bar => {
    bar.style.height = `${scrollFraction * 100}%`;
  });

  // Fade out Intro Section early in the scroll
  // It completely fades out by the time we scroll 15% of the page
  const introFadeFraction = Math.max(0, 1 - (scrollFraction / 0.15));
  introSection.style.opacity = introFadeFraction;

  // Fade in Outro Section near the end
  // It starts fading in at 85% and is fully visible at 100%
  const outroFadeFraction = Math.max(0, (scrollFraction - 0.85) / 0.15);
  outroSection.style.opacity = outroFadeFraction;

  // If we scroll past the start, brighten the canvas video for better visibility 
  // than the dark overlay text screen needed
  if (scrollTop > 10) {
    document.body.classList.add('scrolling');
  } else {
    document.body.classList.remove('scrolling');
  }
};

window.addEventListener('scroll', () => {
  requestAnimationFrame(handleScroll);
});

// Re-adjust if window is resized just in case
window.addEventListener('resize', () => {
    if (images[0] && images[0].complete) {
        setupCanvas(images[0]);
        handleScroll();
    }
});

// Kick off
preloadImages();
