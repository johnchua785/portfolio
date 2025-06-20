// Sidebar toggle
document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("backdrop");

  sidebar.classList.toggle("active");
  backdrop.classList.toggle("active");

  backdrop.addEventListener("click", () => {
    sidebar.classList.remove("active");
    backdrop.classList.remove("active");
  });
});

// Theme toggle
document.getElementById("toggleTheme").addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute(
    "data-theme",
    currentTheme === "dark" ? "light" : "dark"
  );
});

// Set light theme by default
document.documentElement.setAttribute("data-theme", "light");

// Dynamically load images into galleries
function loadImages(folder, containerId, imageCount) {
  const container = document.getElementById(containerId);
  
  for (let i = 1; i <= imageCount; i++) {
    const img = document.createElement("img");
    const basePath = `${folder}/${folder}${i}`;
    
    img.src = `${basePath}.png`; // Try lowercase first
    img.alt = `${folder} image ${i}`;

    img.onerror = () => {
      img.src = `${basePath}.PNG`; // Fallback to uppercase
    };

    container.appendChild(img);
  }
}

// Lightbox functionality
let currentGallery = [];
let currentIndex = 0;

function openLightbox(images, index) {
  currentGallery = images;
  currentIndex = index;

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  lightboxImg.src = currentGallery[currentIndex].src;
  lightbox.classList.add("show");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("show");
}

function showNextImage(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = currentGallery.length - 1;
  if (currentIndex >= currentGallery.length) currentIndex = 0;

  document.getElementById("lightbox-img").src = currentGallery[currentIndex].src;
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  // Load images
  loadImages("art", "art-gallery", 12);
  loadImages("other", "other-gallery", 6);

  // Tab switching
  document.querySelectorAll('.sidebar nav a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetTab = document.getElementById(targetId);

      document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));

      setTimeout(() => {
        if (targetTab) targetTab.classList.add("active");
      }, 50);
    });
  });

  // Image click to open lightbox
  document.addEventListener("click", function (e) {
    if (e.target.tagName === "IMG" && e.target.closest(".image-gallery")) {
      const gallery = Array.from(e.target.closest(".image-gallery").querySelectorAll("img"));
      const index = gallery.indexOf(e.target);
      openLightbox(gallery, index);
    }
  });

  // Lightbox navigation
  document.querySelector(".lightbox .close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox").addEventListener("click", e => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.querySelector(".lightbox .left").addEventListener("click", () => showNextImage(-1));
  document.querySelector(".lightbox .right").addEventListener("click", () => showNextImage(1));
  document.addEventListener("keydown", e => {
    if (!document.getElementById("lightbox").classList.contains("show")) return;
    if (e.key === "ArrowLeft") showNextImage(-1);
    if (e.key === "ArrowRight") showNextImage(1);
    if (e.key === "Escape") closeLightbox();
  });
});
