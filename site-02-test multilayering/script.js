const tunnel = document.querySelector('.tunnel');
const sections = document.querySelectorAll('.tunnel-section');

let scrollZ = -400; // Start at -100 so Section 1 is slightly further back
let touchStartY = 0;
let touchEndY = 0;

// Scroll event for mouse
window.addEventListener('wheel', (event) => {
  event.preventDefault();
  scrollZ += event.deltaY * 0.5;
  updateSections();
});

// Touch event for mobile scrolling
window.addEventListener("touchstart", (event) => {
  touchStartY = event.touches[0].clientY;
});

window.addEventListener("touchmove", (event) => {
  touchEndY = event.touches[0].clientY;
  let deltaY = touchStartY - touchEndY;

  scrollZ += deltaY * 0.5; // Adjust scroll speed for touch
  updateSections();

  touchStartY = touchEndY; // Update start position
});

// Ensure correct positioning on page load
window.addEventListener("DOMContentLoaded", () => {
  updateSections();
});

function updateSections() {
  sections.forEach((section, index) => {
    const z = -index * 1000 + scrollZ;
    section.style.transform = `translateZ(${z}px)`;

    // Show only the section that is within the focused range (-1010px to -10px)
    if (z > -1010 && z < -10) { 
      section.style.opacity = 1;
    } else {
      section.style.opacity = 0;
    }
  });
}


document.querySelector('.navbar ul li a[href="#section3"]').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default jump
    scrollZ = 1700; // Move Section 3 to -100px
    updateSections();
});

document.querySelector('.navbar ul li a[href="#section2"]').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default jump
    scrollZ = 700; // Move Section 3 to -100px
    updateSections();
});

document.querySelector('.navbar ul li a[href="#section4"]').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default jump
    scrollZ = 2700; // Move Section 3 to -100px
    updateSections();
});

document.querySelectorAll('.back-text').forEach((backElement) => {
    backElement.addEventListener('click', function () {
        scrollZ = -400; // Reset scroll position to 100
        updateSections();
    });
});



// Select the carousel elements
let currentSlide = 0;
const carouselImages = document.querySelector(".carousel-images");
const totalSlides = document.querySelectorAll(".carousel-img").length;

// Function to move the carousel
function moveSlide(direction) {
    currentSlide += direction;

    // Wrap around when reaching the first or last slide
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    // Move the carousel by translating the images
    carouselImages.style.transform = `translateX(${-currentSlide * 100}%)`;
}

// Initialize the first slide position
carouselImages.style.transform = `translateX(0)`;
