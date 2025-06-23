// Sidebar toggle
document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("backdrop");
  sidebar.classList.toggle("active");
  backdrop.classList.toggle("active");
});

// Close sidebar when clicking backdrop
document.getElementById("backdrop").addEventListener("click", () => {
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("backdrop").classList.remove("active");
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

// Load images helper
function loadImages(folder, containerId, imageCount) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  for (let i = 1; i <= imageCount; i++) {
    const img = document.createElement('img');
    const basePath = `${folder}/${folder}${i}`;
    img.src = `${basePath}.png`;
    img.alt = `${folder} image ${i}`;
    img.onerror = () => {
      img.src = `${basePath}.PNG`;
    };
    container.appendChild(img);
  }
}

// Lightbox
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
  currentIndex = (currentIndex + direction + currentGallery.length) % currentGallery.length;
  document.getElementById("lightbox-img").src = currentGallery[currentIndex].src;
}

window.addEventListener("DOMContentLoaded", () => {
  // Default tab: 2d
  const defaultTabId = "tab-2d";
  const defaultTab = document.getElementById(defaultTabId);
  if (defaultTab) {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    defaultTab.classList.add("active");
    loadImages("2d", "gallery-2d", 8);
  }

  // Tab links handler
  document.querySelectorAll('.sidebar nav a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetTab = document.getElementById(targetId);
      if (!targetTab) return;

      document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
      targetTab.classList.add("active");

      if (targetId === "tab-2d") {
        loadImages("2d", "gallery-2d", 8);
      } else if (targetId === "tab-3d") {
        loadImages("3d", "gallery-3d", 6);
      }
      // For demo reel (tab-demo), you can just show static content or embed video, no images

      // Close sidebar on mobile
      document.getElementById("sidebar").classList.remove("active");
      document.getElementById("backdrop").classList.remove("active");
    });
  });

  // Load tab from URL hash
  const hash = window.location.hash.substring(1);
  if (hash) {
    const targetTab = document.getElementById(hash);
    if (targetTab) {
      document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
      targetTab.classList.add("active");

      if (hash === "tab-2d") {
        loadImages("2d", "gallery-2d", 8);
      } else if (hash === "tab-3d") {
        loadImages("3d", "gallery-3d", 6);
      }
    }
  }

  // Lightbox image click
  document.addEventListener("click", e => {
    if (e.target.tagName === "IMG" && e.target.closest(".image-gallery")) {
      const gallery = Array.from(e.target.closest(".image-gallery").querySelectorAll("img"));
      const index = gallery.indexOf(e.target);
      openLightbox(gallery, index);
    }
  });

  // Lightbox controls
  document.querySelector(".lightbox .close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox").addEventListener("click", e => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.querySelector(".lightbox .left").addEventListener("click", () => showNextImage(-1));
  document.querySelector(".lightbox .right").addEventListener("click", () => showNextImage(1));

  // Keyboard controls
  document.addEventListener("keydown", e => {
    if (!document.getElementById("lightbox").classList.contains("show")) return;

    if (e.key === "ArrowLeft") showNextImage(-1);
    if (e.key === "ArrowRight") showNextImage(1);
    if (e.key === "Escape") closeLightbox();
  });
});
