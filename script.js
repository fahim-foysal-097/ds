/**
 * Nintendo DS Retro Interactive Portfolio Engine (v4.0)
 * Manages responsive UI, realistic 3D game cartridges, modern <dialog> manuals,
 * category filters, live cartridge search, DS Calendar & Clock widget,
 * DS Lounge console (inspired by @aradevich), PictoChat, retro Snake with high scores,
 * soundboard jukebox, and 16 authentic firmware color themes.
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. Projects Data & Specifications
  // ==========================================================================
  const projects = [
    {
      id: "trackedify",
      title: "Trackedify",
      category: "Android • Finance & Insights",
      filterCategory: "mobile",
      desc: "Beautiful, private expense tracking app built for Android with Flutter. Features comprehensive spending insights, interactive analytics charts, category breakdowns, and offline SQLite local storage.",
      tags: ["Flutter", "Dart", "Android", "SQLite", "Finance"],
      url: "https://fahimfoysal.pro.bd/trackedify-web",
      github: "https://github.com/fahim-foysal-097",
      icon: "ph-wallet",
      code: "NTR-TRCK-USA",
      specs: {
        primary: "Flutter / Dart",
        compat: "Android 8.0+ / Web",
        storage: "Offline SQLite DB",
        status: "Production Ready"
      }
    },
    {
      id: "lifeline",
      title: "Lifeline MC",
      category: "Java • Minecraft Paper Plugin",
      filterCategory: "games",
      desc: "Innovative co-op mechanics and shared life support systems engineered for small Paper/Spigot Minecraft servers. Features real-time player vitals sharing, bleedout timers, and revive items.",
      tags: ["Java", "PaperMC", "Spigot", "Gaming", "Multiplayer"],
      url: "https://fahimfoysal.pro.bd/lifeline-mc",
      github: "https://github.com/fahim-foysal-097/lifeline-mc",
      icon: "ph-package",
      code: "NTR-LIFE-USA",
      specs: {
        primary: "Java 21 / Spigot API",
        compat: "Paper / Purpur 1.20+",
        storage: "YAML State Cache",
        status: "Active Release"
      }
    },
    {
      id: "lumen",
      title: "Lumen Screensaver",
      category: "Web • Screensaver Suite",
      filterCategory: "web",
      desc: "An aesthetic screensaver suite for desktop displays featuring over 50 procedurally generated screens, fluid simulations, retro clocks, generative art, and particle systems.",
      tags: ["JavaScript", "HTML5 Canvas", "Creative Coding", "Art"],
      url: "https://fahimfoysal.pro.bd/lumen-screensaver/",
      github: "https://github.com/fahim-foysal-097",
      icon: "ph-monitor",
      code: "NTR-LUMN-USA",
      specs: {
        primary: "Vanilla JS / Canvas",
        compat: "Modern Browsers / PWA",
        storage: "LocalStorage Config",
        status: "50+ Procedural FX"
      }
    },
    {
      id: "physics",
      title: "Physics Lab",
      category: "Web • Educational Simulator",
      filterCategory: "web",
      desc: "Comprehensive interactive laboratory covering HSC Physics concepts, laws, and mathematical formulas with real-time vector simulations and parameter controls.",
      tags: ["JavaScript", "Simulation", "STEM", "Education"],
      url: "https://fahimfoysal.pro.bd/physics",
      github: "https://github.com/fahim-foysal-097",
      icon: "ph-atom",
      code: "NTR-PHYS-USA",
      specs: {
        primary: "HTML5 Canvas / MathJax",
        compat: "Desktop & Tablet",
        storage: "Zero Dependencies",
        status: "Interactive STEM"
      }
    },
    {
      id: "artgallery",
      title: "ArtGallery",
      category: "Web • Creative Showcase",
      filterCategory: "web",
      desc: "A minimalist static gallery portfolio showcasing digital illustrations, traditional ink artwork, and 3D concept renders with smooth transitions.",
      tags: ["Web Design", "CSS3", "Gallery", "Art"],
      url: "https://fahimfoysal.pro.bd/art-gallery",
      github: "https://github.com/fahim-foysal-097",
      icon: "ph-paint-brush-broad",
      code: "NTR-ARTG-USA",
      specs: {
        primary: "Semantic HTML5 / CSS3",
        compat: "Responsive All Devices",
        storage: "Static CDN Assets",
        status: "Curated Showcase"
      }
    },
    {
      id: "wallpapers",
      title: "Wallpapers",
      category: "Web • Asset Archive",
      filterCategory: "web",
      desc: "A curated static wallpaper showcase providing high-resolution original wallpapers tailored for desktop widescreen and mobile OLED resolutions.",
      tags: ["Web", "Design", "Assets", "Mobile"],
      url: "https://fahimfoysal.pro.bd/wallpapers",
      github: "https://github.com/fahim-foysal-097",
      icon: "ph-image",
      code: "NTR-WALL-USA",
      specs: {
        primary: "Responsive CSS Grid",
        compat: "4K UHD & Mobile OLED",
        storage: "WebP Optimized",
        status: "HD Asset Library"
      }
    },
    {
      id: "yearprogress",
      title: "Year Progress",
      category: "JS • Time Widget",
      filterCategory: "web",
      desc: "An elegant, distraction-free visual progress tracker indicating the exact percentage and passage of time for the current calendar year.",
      tags: ["JavaScript", "Widget", "Productivity"],
      url: "https://fahimfoysal.pro.bd/year-progress",
      github: "https://github.com/fahim-foysal-097",
      icon: "ph-clock",
      code: "NTR-YEAR-USA",
      specs: {
        primary: "Vanilla JS DateTime",
        compat: "Universal Web Embed",
        storage: "Hardware Clock Sync",
        status: "Real-Time Gauge"
      }
    },
    {
      id: "quantumshell",
      title: "QuantumShell",
      category: "C • Systems Software",
      filterCategory: "systems",
      desc: "A custom command-line Unix shell written from scratch in C, implementing POSIX process creation, fork/exec pipelines, file redirection, and built-in commands.",
      tags: ["C", "Linux", "Systems", "POSIX", "OS"],
      url: "https://github.com/fahim-foysal-097/QuantumShell",
      github: "https://github.com/fahim-foysal-097/QuantumShell",
      icon: "ph-terminal-window",
      code: "NTR-QSHL-USA",
      specs: {
        primary: "ANSI C (C99) / POSIX",
        compat: "Linux / macOS / BSD",
        storage: "In-Memory AST / Env",
        status: "Core CLI Complete"
      }
    },
    {
      id: "lovegames",
      title: "LÖVE 2D Games",
      category: "Lua • Game Development",
      filterCategory: "games",
      desc: "Experimental 2D gameplay prototypes, platformers, and collision physics engines developed using Lua and the LÖVE 2D framework.",
      tags: ["Lua", "LÖVE 2D", "Game Dev", "Indie"],
      url: "https://github.com/fahim-foysal-097",
      github: "https://github.com/fahim-foysal-097",
      icon: "ph-game-controller",
      code: "NTR-LOVE-USA",
      specs: {
        primary: "Lua 5.1 / LÖVE 11.4+",
        compat: "Cross-Platform Desktop",
        storage: "Custom Save States",
        status: "Prototypes Active"
      }
    }
  ];

  const audio = window.dsAudio;

  // ==========================================================================
  // 2. Toast Notification System
  // ==========================================================================
  const dsToast = document.getElementById("dsToast");
  let toastTimer = null;

  function showToast(message, iconClass = "ph-info") {
    if (!dsToast) return;
    dsToast.innerHTML = `<i class="ph-bold ${iconClass}"></i> <span>${message}</span>`;
    dsToast.classList.add("active");
    if (audio) audio.playSelect();

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      dsToast.classList.remove("active");
    }, 3200);
  }

  // ==========================================================================
  // 3. DS Clocks & Calendar Widget
  // ==========================================================================
  const navClock = document.getElementById("navClock");
  const loungeClock = document.getElementById("loungeClock");
  const loungeDate = document.getElementById("loungeDate");
  const calLiveTime = document.getElementById("calLiveTime");
  const calMonthYearTitle = document.getElementById("calMonthYearTitle");
  const calDaysGrid = document.getElementById("calDaysGrid");

  const hourHand = document.getElementById("hourHand");
  const minuteHand = document.getElementById("minuteHand");
  const secondHand = document.getElementById("secondHand");

  function updateClocks() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    const timeStr = `${displayHours}:${minutes} ${ampm}`;
    const timeWithSec = `${displayHours}:${minutes}:${seconds} ${ampm}`;

    if (navClock) navClock.textContent = timeStr;
    if (loungeClock) loungeClock.textContent = timeStr;
    if (calLiveTime) calLiveTime.textContent = timeWithSec;

    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);
    if (loungeDate) loungeDate.textContent = `${month}/${day}/${year}`;

    // Analog Clock Hands Rotation
    const rawHours = now.getHours();
    const rawMinutes = now.getMinutes();
    const rawSeconds = now.getSeconds();
    const millis = now.getMilliseconds();

    const secAngle = (rawSeconds + millis / 1000) * 6;
    const minAngle = (rawMinutes + rawSeconds / 60) * 6;
    const hourAngle = ((rawHours % 12) + rawMinutes / 60) * 30;

    if (hourHand) hourHand.style.transform = `rotate(${hourAngle}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${minAngle}deg)`;
    if (secondHand) secondHand.style.transform = `rotate(${secAngle}deg)`;
  }
  setInterval(updateClocks, 250);
  updateClocks();

  function buildCalendar() {
    if (!calDaysGrid || !calMonthYearTitle) return;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const monthStr = String(month + 1).padStart(2, "0");
    calMonthYearTitle.textContent = `${monthStr}/${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    calDaysGrid.innerHTML = "";

    // Empty cells before first day of month
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      empty.className = "ds-cal-cell empty";
      calDaysGrid.appendChild(empty);
    }

    // Days of current month
    for (let d = 1; d <= totalDays; d++) {
      const dayOfWeek = (firstDay + d - 1) % 7;
      const cell = document.createElement("div");
      let classes = "ds-cal-cell";
      if (d === today) {
        classes += " today";
      } else if (dayOfWeek === 0) {
        classes += " sunday";
      } else if (dayOfWeek === 6) {
        classes += " saturday";
      }
      cell.className = classes;
      cell.textContent = d;
      calDaysGrid.appendChild(cell);
    }

    // Fill remaining cells in the last week
    const totalRendered = firstDay + totalDays;
    const remainder = totalRendered % 7;
    if (remainder !== 0) {
      const needed = 7 - remainder;
      for (let i = 0; i < needed; i++) {
        const empty = document.createElement("div");
        empty.className = "ds-cal-cell empty";
        calDaysGrid.appendChild(empty);
      }
    }
  }
  buildCalendar();

  // ==========================================================================
  // 4. Navigation & Scrollspy
  // ==========================================================================
  const dsNavMenu = document.getElementById("dsNavMenu");
  const navLinks = document.querySelectorAll(".ds-nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      audio.playStylusTap();
    });
  });

  // Active section scrollspy
  const sections = document.querySelectorAll("section[id]");
  function updateScrollspy() {
    const scrollY = window.pageYOffset + 120;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((l) => {
          l.classList.remove("active");
          if (l.getAttribute("href") === `#${id}`) {
            l.classList.add("active");
          }
        });
      }
    });
  }
  window.addEventListener("scroll", updateScrollspy, { passive: true });

  // Audio Music Toggle Controls
  const navMusicToggle = document.getElementById("navMusicToggle");
  const navMusicIcon = document.getElementById("navMusicIcon");
  const bgmWaveBars = document.getElementById("bgmWaveBars");

  function setBgmUIState(isPlaying) {
    if (navMusicIcon && navMusicToggle) {
      if (isPlaying) {
        navMusicIcon.className = "ph-fill ph-speaker-high";
        navMusicToggle.classList.add("primary");
        bgmWaveBars?.classList.add("active");
      } else {
        navMusicIcon.className = "ph-bold ph-speaker-simple-high";
        navMusicToggle.classList.remove("primary");
        bgmWaveBars?.classList.remove("active");
      }
    }
  }

  if (navMusicToggle) {
    navMusicToggle.addEventListener("click", () => {
      const isPlaying = audio.toggleBGM();
      setBgmUIState(isPlaying);
      showToast(isPlaying ? "Nintendo Shop Marimba BGM Playing" : "BGM Muted", "ph-music-notes");
    });
  }

  // ==========================================================================
  // 5. Render Realistic 3D Nintendo DS Cartridges with Filter & Search
  // ==========================================================================
  const cartridgeGrid = document.getElementById("cartridgeGrid");
  const cartridgeSearchInput = document.getElementById("cartridgeSearchInput");
  const cartridgeSearchClear = document.getElementById("cartridgeSearchClear");
  const cartridgeCountBadge = document.getElementById("cartridgeCountBadge");
  const cartridgeFilterButtons = document.querySelectorAll("#cartridgeFilterGroup .ds-filter-pill");

  let activeCategoryFilter = "all";
  let activeSearchQuery = "";

  function getFilteredProjects() {
    return projects.filter((proj) => {
      const matchesCategory =
        activeCategoryFilter === "all" || proj.filterCategory === activeCategoryFilter;

      const q = activeSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.category.toLowerCase().includes(q) ||
        proj.desc.toLowerCase().includes(q) ||
        proj.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }

  function renderCartridges() {
    if (!cartridgeGrid) return;
    const list = getFilteredProjects();

    if (cartridgeCountBadge) {
      cartridgeCountBadge.textContent = `Showing ${list.length} of ${projects.length}`;
    }

    if (list.length === 0) {
      cartridgeGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #ffffff; border: 2px dashed #cbd5e1; border-radius: 8px;">
          <i class="ph-duotone ph-warning-circle" style="font-size: 36px; color: var(--ds-theme-color);"></i>
          <div style="font-weight: 900; margin-top: 8px; font-size: 15px;">NO CARTRIDGES FOUND</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">No Slot-1 cartridge matches "${activeSearchQuery}". Try clearing your search query.</div>
          <button id="resetSearchBtn" class="ds-btn-system" style="margin-top: 12px;">Reset Filters</button>
        </div>
      `;
      document.getElementById("resetSearchBtn")?.addEventListener("click", () => {
        activeCategoryFilter = "all";
        activeSearchQuery = "";
        if (cartridgeSearchInput) cartridgeSearchInput.value = "";
        if (cartridgeSearchClear) cartridgeSearchClear.style.display = "none";
        cartridgeFilterButtons.forEach((b) => b.classList.toggle("active", b.dataset.filter === "all"));
        renderCartridges();
      });
      return;
    }

    cartridgeGrid.innerHTML = "";

    list.forEach((proj) => {
      const card = document.createElement("div");
      card.className = "ds-cartridge-card";
      card.setAttribute("data-id", proj.id);
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Open manual for ${proj.title} DS cartridge`);

      const iconHtml =`<i class="ph ${proj.icon} ds-sticker-icon"></i>`;

      card.innerHTML = `
        <div class="ds-cartridge-inner">
          <!-- Authentic Sticker positioned behind template cutout -->
          <div class="ds-cartridge-sticker">
            <div class="ds-sticker-header">
              <span>Nintendo DS™</span>
              <span>NTR-005</span>
            </div>
            <div class="ds-sticker-art">
              ${iconHtml}
              <div class="ds-sticker-title">${proj.title}</div>
              <span class="ds-sticker-badge">${proj.tags[0]}</span>
            </div>
            <div class="ds-sticker-footer">
              <span class="ds-sticker-esrb">E</span>
              <span class="ds-sticker-code">${proj.code}</span>
            </div>
          </div>

          <!-- Realistic Molded Cartridge Frame with Notch & Arrow -->
          <img src="assets/images/ds/ds_cart_template.png" class="ds-cartridge-frame" alt="${proj.title} DS Cartridge">
        </div>
      `;

      card.addEventListener("mouseenter", () => {
        audio.playStylusTap();
      });

      card.addEventListener("click", () => {
        audio.playCartridgeSnap();
        openProjectModal(proj);
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          audio.playCartridgeSnap();
          openProjectModal(proj);
        }
      });

      cartridgeGrid.appendChild(card);
    });
  }
  renderCartridges();

  // Category filter handlers
  cartridgeFilterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      audio.playSelect();
      cartridgeFilterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategoryFilter = btn.getAttribute("data-filter") || "all";
      renderCartridges();
    });
  });

  // Search input handlers
  if (cartridgeSearchInput) {
    cartridgeSearchInput.addEventListener("input", (e) => {
      activeSearchQuery = e.target.value;
      if (cartridgeSearchClear) {
        cartridgeSearchClear.style.display = activeSearchQuery ? "block" : "none";
      }
      renderCartridges();
    });
  }

  if (cartridgeSearchClear) {
    cartridgeSearchClear.addEventListener("click", () => {
      activeSearchQuery = "";
      if (cartridgeSearchInput) cartridgeSearchInput.value = "";
      cartridgeSearchClear.style.display = "none";
      audio.playCancel();
      renderCartridges();
    });
  }

  // Inventory Filter Handler
  const skillFilterButtons = document.querySelectorAll("#skillsFilterGroup .ds-filter-pill");
  const inventoryCards = document.querySelectorAll("#inventoryGrid .ds-inventory-card");

  skillFilterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      audio.playSelect();
      skillFilterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.getAttribute("data-skill-filter");

      inventoryCards.forEach((card) => {
        if (cat === "all" || card.getAttribute("data-category") === cat) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // ==========================================================================
  // 6. Modern HTML5 <dialog> Project Details Modal (Game Manual)
  // ==========================================================================
  const projectModal = document.getElementById("projectModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalHeaderTitle = document.getElementById("modalHeaderTitle");
  const modalCartThumb = document.getElementById("modalCartThumb");
  const modalProjectTitle = document.getElementById("modalProjectTitle");
  const modalProjectCategory = document.getElementById("modalProjectCategory");
  const modalCartCode = document.getElementById("modalCartCode");
  const modalProjectTags = document.getElementById("modalProjectTags");
  const modalProjectDesc = document.getElementById("modalProjectDesc");
  const modalLiveBtn = document.getElementById("modalLiveBtn");
  const modalGithubBtn = document.getElementById("modalGithubBtn");
  const modalInsertBtn = document.getElementById("modalInsertBtn");
  const modalPrevBtn = document.getElementById("modalPrevBtn");
  const modalNextBtn = document.getElementById("modalNextBtn");
  const modalIndexCounter = document.getElementById("modalIndexCounter");

  // Specs Tab Elements
  const modalSpecPrimary = document.getElementById("modalSpecPrimary");
  const modalSpecCompat = document.getElementById("modalSpecCompat");
  const modalSpecStorage = document.getElementById("modalSpecStorage");
  const modalSpecSerial = document.getElementById("modalSpecSerial");

  let activeModalIndex = 0;

  function populateModalContent(proj) {
    activeModalIndex = projects.findIndex((p) => p.id === proj.id);
    if (activeModalIndex === -1) activeModalIndex = 0;

    if (modalHeaderTitle) modalHeaderTitle.textContent = `GAME MANUAL: ${proj.title.toUpperCase()}`;
    if (modalCartThumb) {
      modalCartThumb.innerHTML = `<i class="ph ${proj.icon}"></i>`;
    }
    if (modalProjectTitle) modalProjectTitle.textContent = proj.title;
    if (modalProjectCategory) modalProjectCategory.textContent = proj.category;
    if (modalCartCode) modalCartCode.textContent = proj.code;
    if (modalProjectDesc) modalProjectDesc.textContent = proj.desc;
    if (modalLiveBtn) modalLiveBtn.href = proj.url;
    if (modalGithubBtn) modalGithubBtn.href = proj.github;

    if (modalIndexCounter) {
      modalIndexCounter.textContent = `Cartridge ${activeModalIndex + 1} of ${projects.length}`;
    }

    if (modalProjectTags) {
      modalProjectTags.innerHTML = proj.tags
        .map((t) => `<span class="ds-btn-system ds-btn-mini">${t}</span>`)
        .join("");
    }

    // Populate specs
    if (proj.specs) {
      if (modalSpecPrimary) modalSpecPrimary.textContent = proj.specs.primary;
      if (modalSpecCompat) modalSpecCompat.textContent = proj.specs.compat;
      if (modalSpecStorage) modalSpecStorage.textContent = proj.specs.storage;
      if (modalSpecSerial) modalSpecSerial.textContent = proj.code;
    }
  }

  function openProjectModal(proj) {
    populateModalContent(proj);

    if (projectModal && typeof projectModal.showModal === "function") {
      projectModal.showModal();
    }
  }

  function closeProjectModal() {
    audio.playCancel();
    if (projectModal && typeof projectModal.close === "function") {
      projectModal.close();
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProjectModal);

  // Fallback for browsers without native <dialog closedby> attribute support
  if (projectModal && !("closedBy" in HTMLDialogElement.prototype)) {
    projectModal.addEventListener("click", (event) => {
      if (event.target !== projectModal) return;
      const rect = projectModal.getBoundingClientRect();
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInside) {
        closeProjectModal();
      }
    });
  }

  // Instruction Manual Tabs Logic
  const manualTabs = document.querySelectorAll(".ds-manual-tab");
  manualTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      audio.playStylusTap();
      const target = tab.getAttribute("data-manual-tab");
      manualTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      document.getElementById("manualTabOverview")?.classList.toggle("active", target === "overview");
      document.getElementById("manualTabSpecs")?.classList.toggle("active", target === "specs");
      document.getElementById("manualTabControls")?.classList.toggle("active", target === "controls");
    });
  });

  // Next / Previous Cartridge Page Flip
  if (modalPrevBtn) {
    modalPrevBtn.addEventListener("click", () => {
      audio.playStylusTap();
      activeModalIndex = (activeModalIndex - 1 + projects.length) % projects.length;
      populateModalContent(projects[activeModalIndex]);
    });
  }

  if (modalNextBtn) {
    modalNextBtn.addEventListener("click", () => {
      audio.playStylusTap();
      activeModalIndex = (activeModalIndex + 1) % projects.length;
      populateModalContent(projects[activeModalIndex]);
    });
  }

  // Keyboard navigation when modal is open
  window.addEventListener("keydown", (e) => {
    if (projectModal && projectModal.open) {
      if (e.key === "ArrowLeft") {
        audio.playStylusTap();
        activeModalIndex = (activeModalIndex - 1 + projects.length) % projects.length;
        populateModalContent(projects[activeModalIndex]);
      } else if (e.key === "ArrowRight") {
        audio.playStylusTap();
        activeModalIndex = (activeModalIndex + 1) % projects.length;
        populateModalContent(projects[activeModalIndex]);
      }
    }
  });

  if (modalInsertBtn) {
    modalInsertBtn.addEventListener("click", () => {
      audio.playCartridgeSnap();
      const cur = projects[activeModalIndex];
      closeProjectModal();
      loadProjectIntoDSLounge(cur);
      showToast(`Slot-1 Loaded: ${cur.title}`, "ph-cards");
      const loungeEl = document.getElementById("ds-lounge");
      if (loungeEl) {
        loungeEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // ==========================================================================
  // 7. Nintendo DS Console Lounge Logic (Top & Bottom Screens)
  // ==========================================================================
  const loungeTopIcon = document.getElementById("loungeTopIcon");
  const loungeTopTitle = document.getElementById("loungeTopTitle");
  const loungeTopSub = document.getElementById("loungeTopSub");
  const loungeCartridgeStatus = document.getElementById("loungeCartridgeStatus");

  let currentSlot1Project = projects[0];

  function loadProjectIntoDSLounge(proj) {
    currentSlot1Project = proj;
    if (loungeTopIcon) {
      loungeTopIcon.innerHTML = `<i class="ph-duotone ${proj.icon}"></i>`;
    }
    if (loungeTopTitle) loungeTopTitle.textContent = proj.title.toUpperCase();
    if (loungeTopSub) loungeTopSub.textContent = proj.category;
    if (loungeCartridgeStatus) loungeCartridgeStatus.textContent = `SLOT-1: ${proj.title.toUpperCase()}`;
  }

  // Views & Splash Screen
  const loungeSplash = document.getElementById("loungeSplash");
  const viewDsiMenu = document.getElementById("viewDsiMenu");
  const viewPicto = document.getElementById("viewPicto");
  const viewSnake = document.getElementById("viewSnake");
  const viewSound = document.getElementById("viewSound");

  function setTopScreenTelemetry(title, sub, iconClass = "ph-game-controller") {
    if (loungeTopTitle) loungeTopTitle.textContent = title;
    if (loungeTopSub) loungeTopSub.textContent = sub;
    if (loungeTopIcon) loungeTopIcon.innerHTML = `<i class="ph-duotone ${iconClass}"></i>`;
  }

  function switchLoungeView(viewName) {
    if (viewDsiMenu) viewDsiMenu.classList.remove("active");
    if (viewPicto) viewPicto.classList.remove("active");
    if (viewSnake) viewSnake.classList.remove("active");
    if (viewSound) viewSound.classList.remove("active");

    if (snakeLoop) {
      clearInterval(snakeLoop);
      snakeLoop = null;
    }

    if (viewName === "menu" && viewDsiMenu) {
      viewDsiMenu.classList.add("active");
      setTopScreenTelemetry("DSi HOME MENU", "Select Application", "ph-house-line");
    } else if (viewName === "picto" && viewPicto) {
      viewPicto.classList.add("active");
      setTopScreenTelemetry("PICTOCHAT: ROOM A", "2 Online • DS-Bot Ready", "ph-chat-circle-dots");
    } else if (viewName === "snake" && viewSnake) {
      viewSnake.classList.add("active");
      initSnake();
    } else if (viewName === "sound" && viewSound) {
      viewSound.classList.add("active");
      setTopScreenTelemetry("DS SOUND TEST", "8-Bit Synthesizer Engine", "ph-speaker-high");
    }
  }

  if (loungeSplash) {
    const bootDS = () => {
      audio.playBootChime();
      loungeSplash.classList.add("hidden");
      switchLoungeView("menu");
    };
    loungeSplash.addEventListener("click", bootDS);
    loungeSplash.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") bootDS();
    });
  }

  // DSi Horizontal Carousel Menu Action Handlers
  document.querySelectorAll(".dsi-app-icon").forEach((iconEl) => {
    const handleAction = () => {
      const action = iconEl.getAttribute("data-dsi-action");
      if (action === "picto") {
        audio.playSelect();
        switchLoungeView("picto");
      } else if (action === "snake") {
        audio.playSelect();
        switchLoungeView("snake");
      } else if (action === "cartridge") {
        audio.playCartridgeSnap();
        openProjectModal(currentSlot1Project);
      } else if (action === "sound") {
        audio.playSelect();
        switchLoungeView("sound");
      }
    };

    iconEl.addEventListener("click", handleAction);
    iconEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") handleAction();
    });
  });

  // Home Return Buttons
  document.getElementById("pictoHomeBtn")?.addEventListener("click", () => {
    audio.playCancel();
    switchLoungeView("menu");
  });

  document.getElementById("snakeHomeBtn")?.addEventListener("click", () => {
    audio.playCancel();
    switchLoungeView("menu");
  });

  document.getElementById("soundHomeBtn")?.addEventListener("click", () => {
    audio.playCancel();
    switchLoungeView("menu");
  });

  // ==========================================================================
  // 8. PictoChat Canvas Logic (50px fitted without clipping)
  // ==========================================================================
  const pictoMessageBoard = document.getElementById("pictoMessageBoard");
  const pictoCanvas = document.getElementById("pictoCanvas");
  const penBtn = document.getElementById("penBtn");
  const penColorBtn = document.getElementById("penColorBtn");
  const eraserBtn = document.getElementById("eraserBtn");
  const loungeClearBtn = document.getElementById("loungeClearBtn");
  const sendPictoBtn = document.getElementById("sendPictoBtn");
  const stampStarBtn = document.getElementById("stampStarBtn");
  const stampHeartBtn = document.getElementById("stampHeartBtn");

  if (pictoCanvas) {
    const ctx = pictoCanvas.getContext("2d");
    let isDrawing = false;
    let mode = "pen"; // "pen" or "eraser"
    let penColorMode = "black"; // "black" or "theme"

    function resetCanvas() {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pictoCanvas.width, pictoCanvas.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
    resetCanvas();

    function getCoords(e) {
      const rect = pictoCanvas.getBoundingClientRect();
      const scaleX = pictoCanvas.width / rect.width;
      const scaleY = pictoCanvas.height / rect.height;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    function startDraw(e) {
      isDrawing = true;
      audio.playStylusTap();
      const { x, y } = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    function draw(e) {
      if (!isDrawing) return;
      const { x, y } = getCoords(e);
      if (mode === "eraser") {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 6;
      } else {
        const themeHex = getComputedStyle(document.documentElement).getPropertyValue("--ds-theme-color").trim() || "#0059f3";
        ctx.strokeStyle = penColorMode === "theme" ? themeHex : "#000000";
        ctx.lineWidth = 2;
      }
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    function stopDraw() {
      isDrawing = false;
    }

    pictoCanvas.addEventListener("mousedown", startDraw);
    pictoCanvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stopDraw);

    pictoCanvas.addEventListener("touchstart", (e) => { e.preventDefault(); startDraw(e); }, { passive: false });
    pictoCanvas.addEventListener("touchmove", (e) => { e.preventDefault(); draw(e); }, { passive: false });
    pictoCanvas.addEventListener("touchend", stopDraw);

    if (penBtn) {
      penBtn.addEventListener("click", () => {
        audio.playStylusTap();
        mode = "pen";
        penBtn.classList.add("primary");
        eraserBtn?.classList.remove("primary");
      });
    }

    if (penColorBtn) {
      penColorBtn.addEventListener("click", () => {
        audio.playStylusTap();
        penColorMode = penColorMode === "black" ? "theme" : "black";
        penColorBtn.textContent = penColorMode === "theme" ? "Theme" : "Black";
        if (penColorMode === "theme") {
          penColorBtn.classList.add("primary");
        } else {
          penColorBtn.classList.remove("primary");
        }
      });
    }

    if (eraserBtn) {
      eraserBtn.addEventListener("click", () => {
        audio.playStylusTap();
        mode = "eraser";
        eraserBtn.classList.add("primary");
        penBtn?.classList.remove("primary");
      });
    }

    if (stampStarBtn) {
      stampStarBtn.addEventListener("click", () => {
        audio.playStylusTap();
        ctx.font = "16px sans-serif";
        ctx.fillText("⭐", 15 + Math.random() * 160, 28);
      });
    }

    if (stampHeartBtn) {
      stampHeartBtn.addEventListener("click", () => {
        audio.playStylusTap();
        ctx.font = "16px sans-serif";
        ctx.fillText("❤️", 15 + Math.random() * 160, 28);
      });
    }

    if (loungeClearBtn) {
      loungeClearBtn.addEventListener("click", () => {
        audio.playCancel();
        resetCanvas();
      });
    }

    if (sendPictoBtn && pictoMessageBoard) {
      sendPictoBtn.addEventListener("click", () => {
        audio.playPictoChatSend();
        const dataUrl = pictoCanvas.toDataURL();

        const bubble = document.createElement("div");
        bubble.className = "picto-bubble";
        bubble.innerHTML = `
          <strong>YOU:</strong><br>
          <img src="${dataUrl}" style="max-width:100%; height:auto; margin-top:2px; image-rendering:pixelated; border:1px solid #cbd5e1;">
        `;
        pictoMessageBoard.appendChild(bubble);
        pictoMessageBoard.scrollTop = pictoMessageBoard.scrollHeight;

        resetCanvas();

        const botReplies = [
          "Great sketch! Check out the Slot-1 games too.",
          "Nice doodle! Tap < DSi to check out Snake or Sound.",
          "Awesome stylus art! Wireless connection active.",
          "DS-Bot approves! Try switching the favorite color theme."
        ];
        const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];

        setTimeout(() => {
          const botBubble = document.createElement("div");
          botBubble.className = "picto-bubble";
          botBubble.innerHTML = `<strong>DS-BOT:</strong> ${randomReply}`;
          pictoMessageBoard.appendChild(botBubble);
          pictoMessageBoard.scrollTop = pictoMessageBoard.scrollHeight;
          audio.playSelect();
        }, 600);
      });
    }
  }

  // ==========================================================================
  // 9. Retro Snake Game with High Score & Real-Time Top Screen
  // ==========================================================================
  const snakeCanvas = document.getElementById("snakeCanvas");
  const snakeScoreEl = document.getElementById("snakeScore");
  const snakeHiScoreDisplay = document.getElementById("snakeHiScoreDisplay");
  const snakeGameOverOverlay = document.getElementById("snakeGameOverOverlay");
  const snakeFinalScore = document.getElementById("snakeFinalScore");
  const snakeBestScore = document.getElementById("snakeBestScore");
  const snakeRestartBtn = document.getElementById("snakeRestartBtn");

  let snake = [{ x: 10, y: 6 }];
  let food = { x: 5, y: 5 };
  let dir = { x: 1, y: 0 };
  let snakeLoop = null;
  let snakeScore = 0;
  let snakeHiScore = parseInt(localStorage.getItem("ds-snake-hiscore") || "0", 10);
  const gridSize = 10;

  if (snakeHiScoreDisplay) snakeHiScoreDisplay.textContent = snakeHiScore;

  function initSnake() {
    snake = [{ x: 10, y: 6 }, { x: 9, y: 6 }, { x: 8, y: 6 }];
    dir = { x: 1, y: 0 };
    snakeScore = 0;
    if (snakeScoreEl) snakeScoreEl.textContent = snakeScore;
    if (snakeGameOverOverlay) snakeGameOverOverlay.style.display = "none";
    placeFood();
    if (snakeLoop) clearInterval(snakeLoop);
    snakeLoop = setInterval(updateSnake, 125);
    setTopScreenTelemetry("GBA: SNAKE", `Score: 0 | Best: ${snakeHiScore}`, "ph-snake");
  }

  function placeFood() {
    if (!snakeCanvas) return;
    const cols = Math.floor(snakeCanvas.width / gridSize);
    const rows = Math.floor(snakeCanvas.height / gridSize);
    food = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows)
    };
  }

  function handleSnakeGameOver() {
    audio.playCancel();
    if (snakeLoop) clearInterval(snakeLoop);
    snakeLoop = null;

    if (snakeScore > snakeHiScore) {
      snakeHiScore = snakeScore;
      localStorage.setItem("ds-snake-hiscore", String(snakeHiScore));
      if (snakeHiScoreDisplay) snakeHiScoreDisplay.textContent = snakeHiScore;
      showToast(`New Personal Best: ${snakeHiScore} PTS!`, "ph-trophy");
    }

    if (snakeFinalScore) snakeFinalScore.textContent = snakeScore;
    if (snakeBestScore) snakeBestScore.textContent = snakeHiScore;
    if (snakeGameOverOverlay) snakeGameOverOverlay.style.display = "flex";
    setTopScreenTelemetry("GAME OVER", `Final: ${snakeScore} | Best: ${snakeHiScore}`, "ph-skull");
  }

  function updateSnake() {
    if (!snakeCanvas || !viewSnake || !viewSnake.classList.contains("active")) return;
    const sCtx = snakeCanvas.getContext("2d");
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    const cols = Math.floor(snakeCanvas.width / gridSize);
    const rows = Math.floor(snakeCanvas.height / gridSize);

    if (head.x < 0) head.x = cols - 1;
    if (head.x >= cols) head.x = 0;
    if (head.y < 0) head.y = rows - 1;
    if (head.y >= rows) head.y = 0;

    // Self collision
    if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      handleSnakeGameOver();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      snakeScore += 10;
      if (snakeScoreEl) snakeScoreEl.textContent = snakeScore;
      audio.playStylusTap();
      placeFood();
      setTopScreenTelemetry("GBA: SNAKE", `Score: ${snakeScore} | Best: ${snakeHiScore}`, "ph-snake");
    } else {
      snake.pop();
    }

    sCtx.fillStyle = "#0f172a";
    sCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    // Food
    sCtx.fillStyle = "#ef4444";
    sCtx.fillRect(food.x * gridSize + 1, food.y * gridSize + 1, gridSize - 2, gridSize - 2);

    // Snake Body & Head
    snake.forEach((seg, i) => {
      sCtx.fillStyle = i === 0 ? "#38bdf8" : "#22c55e";
      sCtx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });
  }

  if (snakeRestartBtn) {
    snakeRestartBtn.addEventListener("click", () => {
      audio.playSelect();
      initSnake();
    });
  }

  // D-Pad Steer
  const dpadEl = document.getElementById("loungeDpad");
  if (dpadEl) {
    dpadEl.addEventListener("click", (e) => {
      audio.playStylusTap();
      const rect = dpadEl.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      if (Math.abs(x) > Math.abs(y)) {
        if (x > 0 && dir.x === 0) dir = { x: 1, y: 0 };
        else if (x < 0 && dir.x === 0) dir = { x: -1, y: 0 };
      } else {
        if (y > 0 && dir.y === 0) dir = { x: 0, y: 1 };
        else if (y < 0 && dir.y === 0) dir = { x: 0, y: -1 };
      }
    });
  }

  window.addEventListener("keydown", (e) => {
    if (viewSnake && viewSnake.classList.contains("active")) {
      if ((e.key === "ArrowUp" || e.key === "w") && dir.y === 0) {
        e.preventDefault();
        dir = { x: 0, y: -1 };
      } else if ((e.key === "ArrowDown" || e.key === "s") && dir.y === 0) {
        e.preventDefault();
        dir = { x: 0, y: 1 };
      } else if ((e.key === "ArrowLeft" || e.key === "a") && dir.x === 0) {
        e.preventDefault();
        dir = { x: -1, y: 0 };
      } else if ((e.key === "ArrowRight" || e.key === "d") && dir.x === 0) {
        e.preventDefault();
        dir = { x: 1, y: 0 };
      }
    }
  });

  // ==========================================================================
  // 10. Sound & Jukebox Test View Handlers
  // ==========================================================================
  const soundActiveStatus = document.getElementById("soundActiveStatus");
  const soundBgmToggleBtn = document.getElementById("soundBgmToggleBtn");

  document.querySelectorAll(".ds-sound-test-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sfx = btn.getAttribute("data-sfx");
      let name = "SFX";
      if (sfx === "boot") {
        audio.playBootChime();
        name = "BOOT CHIME";
      } else if (sfx === "tap") {
        audio.playStylusTap();
        name = "STYLUS TAP";
      } else if (sfx === "select") {
        audio.playSelect();
        name = "MENU SELECT";
      } else if (sfx === "cancel") {
        audio.playCancel();
        name = "CANCEL BLIP";
      } else if (sfx === "cartridge") {
        audio.playCartridgeSnap();
        name = "CARTRIDGE SNAP";
      } else if (sfx === "picto") {
        audio.playPictoChatSend();
        name = "PICTO CHAT SEND";
      }

      if (soundActiveStatus) soundActiveStatus.textContent = name;
      setTopScreenTelemetry(name, "Audio Synthesizer Test", "ph-speaker-high");
    });
  });

  if (soundBgmToggleBtn) {
    soundBgmToggleBtn.addEventListener("click", () => {
      const isPlaying = audio.toggleBGM();
      setBgmUIState(isPlaying);
      soundBgmToggleBtn.innerHTML = isPlaying
        ? `<i class="ph-bold ph-pause"></i> Pause Nintendo BGM Shop Marimba`
        : `<i class="ph-bold ph-play"></i> Play Nintendo BGM Shop Marimba`;
      showToast(isPlaying ? "BGM Shop Playing" : "BGM Muted", "ph-music-notes");
    });
  }

  // ==========================================================================
  // 11. Face Buttons (A, B, X, Y, Start, Select)
  // ==========================================================================
  ["A", "B", "X", "Y"].forEach((btnId) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener("click", () => {
        if (btnId === "A") {
          audio.playSelect();
          if (snakeGameOverOverlay && snakeGameOverOverlay.style.display !== "none") {
            initSnake();
          }
        } else if (btnId === "B") {
          audio.playCancel();
          if (
            viewPicto?.classList.contains("active") ||
            viewSnake?.classList.contains("active") ||
            viewSound?.classList.contains("active")
          ) {
            switchLoungeView("menu");
          }
        } else {
          audio.playStylusTap();
        }
        btn.style.transform = "translateY(2px)";
        setTimeout(() => (btn.style.transform = "none"), 100);
      });
    }
  });

  document.getElementById("start")?.addEventListener("click", () => {
    audio.playBootChime();
    if (loungeSplash && !loungeSplash.classList.contains("hidden")) {
      loungeSplash.classList.add("hidden");
    }
    switchLoungeView("menu");
  });

  document.getElementById("select")?.addEventListener("click", () => {
    audio.playCancel();
    switchLoungeView("menu");
  });

  // ==========================================================================
  // 12. 16 Official Nintendo DS Colors Theme Customizer (ds.css)
  // ==========================================================================
  const ds16Colors = [
    { name: "Gray", class: "ds-slate", hex: "#61829a" },
    { name: "Brown", class: "ds-maroon", hex: "#ba4900" },
    { name: "Red", class: "ds-red", hex: "#fb0018" },
    { name: "Pink", class: "ds-pink", hex: "#fb8afb" },
    { name: "Orange", class: "ds-orange", hex: "#fb9200" },
    { name: "Yellow", class: "ds-yellow", hex: "#f3e300" },
    { name: "Lime", class: "ds-neonyellow", hex: "#aafb00" },
    { name: "Green", class: "ds-lime", hex: "#00fb00" },
    { name: "Dark Green", class: "ds-green", hex: "#00a238" },
    { name: "Sea Green", class: "ds-teal", hex: "#49db8a" },
    { name: "Turquoise", class: "ds-turquoise", hex: "#30baf3" },
    { name: "Blue", class: "ds-blue", hex: "#0059f3" },
    { name: "Dark Blue", class: "ds-navy", hex: "#000092" },
    { name: "Purple", class: "ds-darkpurple", hex: "#8a00d3" },
    { name: "Violet", class: "ds-magenta", hex: "#d300eb" },
    { name: "Magenta", class: "ds-fuschia", hex: "#fb0092" }
  ];

  const themePalette = document.getElementById("themePalette");
  const activeThemeNameDisplay = document.getElementById("activeThemeNameDisplay");

  function setThemeColor(hex, name = null) {
    document.documentElement.style.setProperty("--ds-theme-color", hex);
    document.documentElement.style.setProperty("--ds-theme-glow", hex + "33");
    localStorage.setItem("ds-theme-color", hex);

    const match = ds16Colors.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
    const themeName = name || (match ? match.name : "Custom");
    if (activeThemeNameDisplay) {
      activeThemeNameDisplay.textContent = themeName;
      activeThemeNameDisplay.style.color = hex;
    }
  }

  if (themePalette) {
    const saved = (localStorage.getItem("ds-theme-color") || "#0059f3").toLowerCase();
    setThemeColor(saved);

    ds16Colors.forEach((c) => {
      const tile = document.createElement("button");
      const isSelected = c.hex.toLowerCase() === saved;
      tile.className = `button-square ds-color-tile ${c.class}` + (isSelected ? " active" : "");
      tile.style.backgroundColor = c.hex;
      tile.title = `${c.name} (${c.hex})`;
      tile.setAttribute("aria-label", `Select ${c.name} Theme`);
      tile.setAttribute("role", "radio");
      tile.setAttribute("aria-checked", isSelected ? "true" : "false");

      tile.addEventListener("click", () => {
        audio.playSelect();
        document.querySelectorAll(".ds-color-tile").forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-checked", "false");
        });
        tile.classList.add("active");
        tile.setAttribute("aria-checked", "true");
        setThemeColor(c.hex, c.name);
        showToast(`Theme changed to ${c.name}`, "ph-palette");
      });
      themePalette.appendChild(tile);
    });
  }

  // ==========================================================================
  // 13. Contact Section: Copy Email Clipboard Action
  // ==========================================================================
  const contactEmailCard = document.getElementById("contactEmailCard");
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const targetEmail = "hello@fahimfoysal.pro.bd";

  function copyEmailAction(e) {
    e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(targetEmail).then(() => {
        showToast(`Copied to Clipboard: ${targetEmail}`, "ph-check-circle");
      });
    } else {
      showToast(`Email: ${targetEmail}`, "ph-envelope");
    }
  }

  contactEmailCard?.addEventListener("click", copyEmailAction);
  copyEmailBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    copyEmailAction(e);
  });
});
