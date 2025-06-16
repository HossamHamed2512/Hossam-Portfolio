// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Global Variables
let currentLanguage = "ar";
let currentTheme = "dark";
let isAnimating = false;

// DOM Elements
const loadingScreen = document.getElementById("loadingScreen");
const scrollProgress = document.getElementById("scrollProgress");
const themeToggleInput = document.getElementById("themeToggle");
const langToggleInput = document.getElementById("langToggle");
const body = document.body;

// Portfolio Elements
const portfolioBtn = document.getElementById("portfolioBtn");
const portfolioBtnEn = document.getElementById("portfolioBtnEn");
const portfolioSection = document.getElementById("portfolioSection");
const portfolioSectionEn = document.getElementById("portfolioSectionEn");
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");
const modalBackdrop = document.getElementById("modalBackdrop");

// Initialize Application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

// App Initialization
function initializeApp() {
  // Check for saved theme and language preferences
  loadUserPreferences();

  // Initialize components
  initLanguageSwitcher();
  initThemeToggle();
  initScrollProgress();
  initLoadingScreen();

  // Initialize animations after loading
  setTimeout(() => {
    initGSAPAnimations();
  }, 1000);

  // Initialize other features
  initFloatingButtons();
  initStatCounters();
  initParallaxEffects();
  initPortfolioFeatures();

  // Performance optimizations
  initLazyLoading();
  initSmoothScrolling();
}

// User Preferences Management
function loadUserPreferences() {
  // Load theme preference
  const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  const savedLang = localStorage.getItem("portfolio-language") || "ar";

  setTheme(savedTheme, false);
  setLanguage(savedLang, false);

  // Update toggle states after DOM is ready
  setTimeout(() => {
    if (themeToggleInput) {
      themeToggleInput.checked = savedTheme === "light";
    }
    if (langToggleInput) {
      langToggleInput.checked = savedLang === "en";
    }
  }, 100);
}

function saveUserPreferences() {
  localStorage.setItem("portfolio-theme", currentTheme);
  localStorage.setItem("portfolio-language", currentLanguage);
}

// Enhanced Language Switcher
function initLanguageSwitcher() {
  if (!langToggleInput) return;
  
  // Set initial state
  langToggleInput.checked = currentLanguage === "en";

  // Add click handler to the entire label area
  const langOptions = document.querySelectorAll(".lang-option");

  langOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();

      if (isAnimating) return;

      const targetLang = option.getAttribute("data-lang");
      if (targetLang === currentLanguage) return;

      // Update toggle state
      langToggleInput.checked = targetLang === "en";

      setLanguage(targetLang, true);
    });
  });

  // Handle toggle input change
  langToggleInput.addEventListener("change", () => {
    if (isAnimating) return;

    const targetLang = langToggleInput.checked ? "en" : "ar";
    setLanguage(targetLang, true);
  });
}

function setLanguage(lang, animate = true) {
  if (isAnimating && animate) return;

  currentLanguage = lang;

  // Update toggle state
  if (langToggleInput) {
    langToggleInput.checked = lang === "en";
  }

  // Update body attribute
  body.setAttribute("data-lang", lang);

  // Update WhatsApp links
  updateContactLinks();

  // Animate language switch if needed
  if (animate) {
    animateLanguageSwitch();
    // Add toggle animation
    animateToggleSwitch("lang");
  }

  // Save preference
  saveUserPreferences();
}

// Enhanced Theme Toggle
function initThemeToggle() {
  if (!themeToggleInput) return;
  
  // Set initial state
  themeToggleInput.checked = currentTheme === "light";

  themeToggleInput.addEventListener("change", () => {
    const newTheme = themeToggleInput.checked ? "light" : "dark";
    setTheme(newTheme, true);
  });

  // Add click handler to theme sides
  const darkSide = document.querySelector(".dark-side");
  const lightSide = document.querySelector(".light-side");

  if (darkSide) {
    darkSide.addEventListener("click", () => {
      if (currentTheme !== "dark") {
        themeToggleInput.checked = false;
        setTheme("dark", true);
      }
    });
  }

  if (lightSide) {
    lightSide.addEventListener("click", () => {
      if (currentTheme !== "light") {
        themeToggleInput.checked = true;
        setTheme("light", true);
      }
    });
  }
}

function setTheme(theme, animate = true) {
  currentTheme = theme;
  body.setAttribute("data-theme", theme);

  // Update toggle state
  if (themeToggleInput) {
    themeToggleInput.checked = theme === "light";
  }

  // Animate theme switch
  if (animate) {
    animateThemeSwitch();
    animateToggleSwitch("theme");
  }

  // Save preference
  saveUserPreferences();
}

// Loading Screen
function initLoadingScreen() {
  if (!loadingScreen) return;
  
  const tl = gsap.timeline();

  // Hide loading screen after delay
  tl.to(loadingScreen, {
    duration: 0.8,
    opacity: 0,
    delay: 1.5,
    ease: "power2.out",
    onComplete: () => {
      loadingScreen.style.display = "none";
      startMainAnimations();
    },
  });
}

// Main Entrance Animations
function startMainAnimations() {
  const tl = gsap.timeline();
  
  const profileContainer = document.querySelector(".profile-container");
  const mainTitle = document.querySelector(".main-title");
  const heroDescription = document.querySelector(".hero-description");

  // Animate profile section
  if (profileContainer) {
    tl.from(profileContainer, {
      duration: 1.2,
      scale: 0.8,
      opacity: 0,
      rotation: -10,
      ease: "back.out(1.7)",
    });
  }

  if (mainTitle) {
    tl.from(
      mainTitle,
      {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
      },
      "-=0.5"
    );
  }

  if (heroDescription) {
    tl.from(
      heroDescription,
      {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: "power2.out",
      },
      "-=0.3"
    );
  }

  // Animate floating contact buttons
  const floatingContact = document.querySelector(".floating-contact");
  if (floatingContact) {
    gsap.fromTo(
      floatingContact,
      {
        x: currentLanguage === "ar" ? 100 : -100,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        delay: 2.5,
        ease: "back.out(1.7)",
      }
    );
  }
}

// Enhanced Scroll Progress
function initScrollProgress() {
  if (!scrollProgress) return;
  
  function updateScrollProgress() {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = Math.min(scrolled, 100) + "%";
  }

  // Throttled scroll handler for better performance
  let ticking = false;

  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
}

// Portfolio Features
function initPortfolioFeatures() {
  // Portfolio button event listeners
  if (portfolioBtn) {
    portfolioBtn.addEventListener("click", () => {
      togglePortfolio("ar");
    });
  }

  if (portfolioBtnEn) {
    portfolioBtnEn.addEventListener("click", () => {
      togglePortfolio("en");
    });
  }

  // Portfolio items click handlers
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  portfolioItems.forEach((item) => {
    item.addEventListener("click", () => {
      const fullImageSrc = item.getAttribute("data-full-image");
      if (fullImageSrc) {
        openImageModal(fullImageSrc);
      }
    });

    // Add hover effects
    item.addEventListener("mouseenter", () => {
      gsap.to(item, {
        scale: 1.05,
        rotationY: 5,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        scale: 1,
        rotationY: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // Modal event listeners
  if (modalClose) {
    modalClose.addEventListener("click", closeImageModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeImageModal);
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && imageModal && imageModal.classList.contains("show")) {
      closeImageModal();
    }
  });
}

function togglePortfolio(lang) {
  const targetSection = lang === "ar" ? portfolioSection : portfolioSectionEn;
  if (!targetSection) return;
  
  const isCurrentlyVisible = targetSection.classList.contains("show");

  if (isCurrentlyVisible) {
    // Hide portfolio
    gsap.to(targetSection, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        targetSection.classList.remove("show");
        targetSection.style.display = "none";
      },
    });
  } else {
    // Show portfolio
    targetSection.style.display = "block";
    targetSection.classList.add("show");

    gsap.fromTo(
      targetSection,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }
    );

    // Animate portfolio items
    const portfolioItems = targetSection.querySelectorAll(".portfolio-item");
    gsap.fromTo(
      portfolioItems,
      {
        opacity: 0,
        y: 30,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.3,
        ease: "back.out(1.7)",
      }
    );

    // Scroll to portfolio section using standard method
    setTimeout(() => {
      const targetPosition = targetSection.offsetTop - 100;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }, 100);
  }
}

function openImageModal(imageSrc) {
  if (!imageModal || !modalImage) return;
  
  modalImage.src = imageSrc;
  imageModal.classList.add("show");

  // Prevent body scroll
  document.body.style.overflow = "hidden";

  // Animate modal entrance
  gsap.fromTo(
    imageModal,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }
  );

  const modalContent = document.querySelector(".modal-content");
  if (modalContent) {
    gsap.fromTo(
      modalContent,
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        delay: 0.1,
        ease: "back.out(1.7)",
      }
    );
  }
}

function closeImageModal() {
  if (!imageModal || !modalImage) return;
  
  // Animate modal exit
  gsap.to(imageModal, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.out",
    onComplete: () => {
      imageModal.classList.remove("show");
      modalImage.src = "";
      // Restore body scroll
      document.body.style.overflow = "";
    },
  });

  const modalContent = document.querySelector(".modal-content");
  if (modalContent) {
    gsap.to(modalContent, {
      scale: 0.8,
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
    });
  }
}

// GSAP Scroll Animations
function initGSAPAnimations() {
  // Animate section titles
  gsap.utils.toArray(".section-title").forEach((title) => {
    gsap.fromTo(
      title,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Animate cards with stagger
  gsap.utils.toArray(".glass-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        y: 60,
        opacity: 0,
        rotationY: 15,
      },
      {
        y: 0,
        opacity: 1,
        rotationY: 0,
        duration: 1,
        delay: index * 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Animate skills with bounce effect
  gsap.utils.toArray(".skill-item").forEach((item, index) => {
    gsap.fromTo(
      item,
      {
        scale: 0,
        opacity: 0,
        rotation: 45,
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.6,
        delay: index * 0.05,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: item,
          start: "top 92%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Animate platforms with flip effect
  gsap.utils.toArray(".platform-item").forEach((item, index) => {
    gsap.fromTo(
      item,
      {
        rotationY: 90,
        opacity: 0,
      },
      {
        rotationY: 0,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 92%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Animate services with slide effect
  gsap.utils.toArray(".service-item").forEach((item, index) => {
    const direction = currentLanguage === "ar" ? 50 : -50;

    gsap.fromTo(
      item,
      {
        x: direction,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 92%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Animate CTA section
  const ctaContent = document.querySelector(".cta-content");
  if (ctaContent) {
    gsap.fromTo(
      ctaContent,
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  // Animate portfolio button
  const portfolioBtnContainer = document.querySelector(".portfolio-btn-container");
  if (portfolioBtnContainer) {
    gsap.fromTo(
      ".portfolio-btn",
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: portfolioBtnContainer,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }
}

// Animated Counters
function initStatCounters() {
  const counters = document.querySelectorAll(".stat-number");
  const observerOptions = {
    threshold: 0.7,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-target"));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.ceil(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
      // Add completion animation
      gsap.to(element, {
        scale: 1.2,
        duration: 0.3,
        ease: "back.out(1.7)",
        yoyo: true,
        repeat: 1,
      });
    }
  };

  updateCounter();
}

// Contact Links Update
function updateContactLinks() {
  const whatsappBtn = document.getElementById("whatsappBtn");
  const phoneBtn = document.querySelector(".phone-btn");

  if (whatsappBtn) {
    if (currentLanguage === "en") {
      whatsappBtn.href =
        "https://api.whatsapp.com/send?phone=201552492512&text=Hello Hossam, I would like to discuss a new project with you";
      whatsappBtn.title = "WhatsApp";
    } else {
      whatsappBtn.href =
        "https://api.whatsapp.com/send?phone=201552492512&text=مرحبا حسام، أريد التحدث معك حول مشروع جديد";
      whatsappBtn.title = "واتساب";
    }
  }

  if (phoneBtn) {
    phoneBtn.title = currentLanguage === "en" ? "Call" : "اتصال";
  }
}

// Floating Buttons Enhancement
function initFloatingButtons() {
  const floatingButtons = document.querySelectorAll(".contact-btn");

  floatingButtons.forEach((btn) => {
    // Add hover sound effect (visual feedback)
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, {
        scale: 1.15,
        rotation: 10,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    });

    // Add click animation
    btn.addEventListener("click", () => {
      gsap.to(btn, {
        scale: 0.9,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    });
  });

  // Add floating animation
  const floatingContact = document.querySelector(".floating-contact");
  if (floatingContact) {
    gsap.to(floatingContact, {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
    });
  }
}

// Parallax Effects
function initParallaxEffects() {
  // Background grid parallax
  const bgGrid = document.querySelector(".bg-grid");
  if (bgGrid) {
    gsap.to(bgGrid, {
      y: () => window.innerHeight * 0.5,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // Profile ring rotation on scroll
  const profileRing = document.querySelector(".profile-ring");
  if (profileRing) {
    gsap.to(profileRing, {
      rotation: 360,
      ease: "none",
      scrollTrigger: {
        trigger: profileRing,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }
}

// Lazy Loading for Images
function initLazyLoading() {
  const images = document.querySelectorAll("img[src]");

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;

        // Add fade-in animation
        gsap.fromTo(
          img,
          { opacity: 0, scale: 1.1 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
        );

        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    imageObserver.observe(img);
  });
}

// Smooth Scrolling Enhancement
function initSmoothScrolling() {
  // Enhanced smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        const targetPosition = target.offsetTop - 80;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Animation Functions
function animateLanguageSwitch() {
  isAnimating = true;

  const contentElements = document.querySelectorAll(".content");

  gsap
    .timeline()
    .to(contentElements, {
      duration: 0.3,
      opacity: 0,
      y: 20,
      stagger: 0.05,
      ease: "power2.out",
    })
    .to(
      contentElements,
      {
        duration: 0.3,
        opacity: 1,
        y: 0,
        stagger: 0.05,
        ease: "power2.out",
        onComplete: () => {
          isAnimating = false;
        },
      },
      "+=0.1"
    );
}

function animateThemeSwitch() {
  // Create a smooth transition effect
  gsap
    .timeline()
    .to(body, {
      duration: 0.3,
      scale: 0.95,
      ease: "power2.out",
    })
    .to(body, {
      duration: 0.3,
      scale: 1,
      ease: "power2.out",
    });
}

// New toggle switch animations
function animateToggleSwitch(type) {
  const selector = type === "lang" ? ".lang-slider" : ".theme-slider";
  const element = document.querySelector(selector);

  if (!element) return;

  gsap
    .timeline()
    .to(element, {
      duration: 0.2,
      scale: 1.1,
      ease: "power2.out",
    })
    .to(element, {
      duration: 0.3,
      scale: 1,
      ease: "back.out(1.7)",
    });

  // Add particle effect for visual feedback
  createToggleParticles(element);
}

// Create particle effect for toggle switches
function createToggleParticles(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 6; i++) {
    const particle = document.createElement("div");
    particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--accent-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            left: ${centerX}px;
            top: ${centerY}px;
        `;

    document.body.appendChild(particle);

    const angle = (i / 6) * Math.PI * 2;
    const distance = 30 + Math.random() * 20;
    const targetX = centerX + Math.cos(angle) * distance;
    const targetY = centerY + Math.sin(angle) * distance;

    gsap.timeline().to(particle, {
      duration: 0.6,
      x: targetX - centerX,
      y: targetY - centerY,
      scale: 0,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle);
        }
      },
    });
  }
}

// Interactive Card Effects
function initInteractiveCards() {
  const cards = document.querySelectorAll(
    ".glass-card, .stat-card, .service-item"
  );

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        scale: 1.02,
        rotationY: 5,
        z: 100,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        scale: 1,
        rotationY: 0,
        z: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    // Add tilt effect based on mouse position
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
}

// Enhanced Performance Monitoring
function initPerformanceOptimizations() {
  // Throttle scroll events
  let scrollTimeout;

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        // Custom scroll-based animations
        updateScrollBasedAnimations();
      }, 16); // ~60fps
    },
    { passive: true }
  );

  // Optimize animations for reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.globalTimeline.timeScale(0.5);
  }
}

function updateScrollBasedAnimations() {
  const scrollY = window.pageYOffset;
  
  const floatingContact = document.querySelector(".floating-contact");
  const bgGrid = document.querySelector(".bg-grid");

  // Update floating elements
  if (floatingContact) {
    gsap.set(floatingContact, {
      y: scrollY * 0.1,
    });
  }

  // Update background elements
  if (bgGrid) {
    gsap.set(bgGrid, {
      y: scrollY * 0.2,
    });
  }
}

// Error Handling and Fallbacks
function initErrorHandling() {
  window.addEventListener("error", (e) => {
    console.warn("Portfolio Error:", e.error);

    // Fallback for failed animations
    if (e.error && e.error.message && e.error.message.includes("gsap")) {
      initFallbackAnimations();
    }
  });
}

function initFallbackAnimations() {
  // Simple CSS-based fallback animations
  const style = document.createElement("style");
  style.textContent = `
        .fallback-fade-in {
            animation: fallbackFadeIn 0.8s ease forwards;
        }
        
        @keyframes fallbackFadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
  document.head.appendChild(style);

  // Apply fallback classes
  document.querySelectorAll(".glass-card, .stat-card").forEach((el) => {
    el.classList.add("fallback-fade-in");
  });
}

// Keyboard Navigation
function initKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "l":
      case "L":
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const newLang = currentLanguage === "ar" ? "en" : "ar";
          if (langToggleInput) {
            langToggleInput.checked = newLang === "en";
          }
          setLanguage(newLang, true);
        }
        break;

      case "t":
      case "T":
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const newTheme = currentTheme === "dark" ? "light" : "dark";
          if (themeToggleInput) {
            themeToggleInput.checked = newTheme === "light";
          }
          setTheme(newTheme, true);
        }
        break;

      case "p":
      case "P":
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const currentBtn = currentLanguage === "ar" ? portfolioBtn : portfolioBtnEn;
          if (currentBtn) {
            currentBtn.click();
          }
        }
        break;
    }
  });
}

// Initialize all interactive features
function initAllInteractiveFeatures() {
  initInteractiveCards();
  initPerformanceOptimizations();
  initErrorHandling();
  initKeyboardNavigation();
}

// Call after main initialization
setTimeout(initAllInteractiveFeatures, 2000);

// Cleanup and optimization on page unload
window.addEventListener("beforeunload", () => {
  // Kill all GSAP animations
  gsap.killTweensOf("*");
});

// Export functions for potential external use
window.PortfolioApp = {
  setLanguage,
  setTheme,
  togglePortfolio,
  openImageModal,
  closeImageModal,
  currentLanguage: () => currentLanguage,
  currentTheme: () => currentTheme,
};
