// ====================== Timeline Opening Animation ======================

const milestones = [
  { year: "1984", event: "出生" },
  { year: "2008", event: "大学毕业" },
  { year: "2009", event: "加入三星" },
  { year: "2013", event: "加入搜狐" },
  { year: "2016", event: "加入京东至今" },
];

const overlay = document.getElementById("timelineOverlay");
const line = document.getElementById("timelineLine");
const itemsContainer = document.getElementById("timelineItems");
const skipBtn = document.getElementById("timelineSkip");

let animationRunning = true;
let timelineItems = [];

// Build timeline items
milestones.forEach((m, i) => {
  const item = document.createElement("div");
  item.className = "timeline-item";
  item.innerHTML = `
    <div class="timeline-dot"></div>
    <div class="timeline-year">${m.year}</div>
    <div class="timeline-event">${m.event}</div>
  `;
  item.dataset.index = i;
  itemsContainer.appendChild(item);
  timelineItems.push(item);
});

// Calculate total animation duration
const ITEM_INTERVAL = 600;  // ms between items
const LINE_STEP = 80;       // ms per line growth step
const LINE_PAUSE = 400;     // ms pause after line reaches each item
const FINAL_PAUSE = 1000;   // ms pause after all items shown
let lineHeight = 0;

function showItem(index) {
  if (index < timelineItems.length) {
    timelineItems[index].classList.add("visible");
  }
}

function growLineTo(targetHeight) {
  const step = () => {
    if (!animationRunning) return;
    if (lineHeight < targetHeight) {
      lineHeight += 2;
      line.style.height = lineHeight + "px";
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}

function startAnimation() {
  let currentIndex = 0;

  const advance = () => {
    if (!animationRunning) return;

    showItem(currentIndex);

    // Calculate target line height for this item
    const itemEl = timelineItems[currentIndex];
    const itemTop = itemEl.offsetTop + itemEl.offsetHeight / 2 - 2;
    growLineTo(itemTop);

    currentIndex++;

    if (currentIndex < milestones.length) {
      // Add a small pause, then go to next item
      setTimeout(advance, ITEM_INTERVAL);
    } else {
      // All items shown - wait then close
      setTimeout(finishAnimation, FINAL_PAUSE);
    }
  };

  // Start after title animation finishes
  setTimeout(advance, 900);
}

function finishAnimation() {
  animationRunning = false;
  overlay.classList.add("hidden");
  // Enable body scroll
  document.body.style.overflow = "";
  // Reveal navbar with a small delay
  setTimeout(() => {
    overlay.style.display = "none";
  }, 900);
}

// Skip button
skipBtn.addEventListener("click", finishAnimation);

// Prevent scrolling while overlay is showing
document.body.style.overflow = "hidden";

// Start
startAnimation();
// Scroll navbar style
const navbar = document.getElementById("navbar");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const current = window.scrollY;
  if (current > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  lastScroll = current;
});

// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("open");
});

// Close mobile menu on link click
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
  });
});

// Scroll-triggered fade-in animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

// Contact form handler
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector("button[type='submit']");
  const original = btn.textContent;

  btn.textContent = "已发送 ✓";
  btn.style.pointerEvents = "none";
  btn.style.opacity = "0.7";

  contactForm.reset();

  setTimeout(() => {
    btn.textContent = original;
    btn.style.pointerEvents = "";
    btn.style.opacity = "";
  }, 2000);
});

// Keyboard: Escape closes mobile menu
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
  }
});
