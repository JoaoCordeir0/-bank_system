/*!
 * Minimal theme switcher
 *
 * Pico.css - https://picocss.com
 * Copyright 2019-2023 - Licensed under MIT
 */

const themeSwitcher = {
    // Config
    _scheme: "auto",
    menuTarget: "details[role='list']",
    buttonsTarget: "a[data-theme-switcher]",
    buttonAttribute: "data-theme-switcher",
    rootAttribute: "data-theme",
    localStorageKey: "picoPreferredColorScheme",
  
    // Init
    init() {
      this.scheme = this.schemeFromLocalStorage;
      this.initSwitchers();
    },
  
    // Get color scheme from local storage
    get schemeFromLocalStorage() {
      if (typeof window.localStorage !== "undefined") {
        if (window.localStorage.getItem(this.localStorageKey) !== null) {
          return window.localStorage.getItem(this.localStorageKey);
        }
      }
      return this._scheme;
    },
  
    // Preferred color scheme
    get preferredColorScheme() {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },
  
    // Init switchers
    initSwitchers() {
      const buttons = document.querySelectorAll(this.buttonsTarget);
      buttons.forEach((button) => {
        button.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            // Set scheme
            this.scheme = button.getAttribute(this.buttonAttribute);
            // Close dropdown
            document.querySelector(this.menuTarget).removeAttribute("open");
          },
          false
        );
      });
    },
  
    // Set scheme
    set scheme(scheme) {
      if (scheme == "auto") {
        this.preferredColorScheme == "dark" ? (this._scheme = "dark") : (this._scheme = "light");
      } else if (scheme == "dark" || scheme == "light") {
        this._scheme = scheme;
      }
      this.applyScheme();
      this.schemeToLocalStorage();
    },
  
    // Get scheme
    get scheme() {
      return this._scheme;
    },
  
    // Apply scheme
    applyScheme() {
      document.querySelector("html").setAttribute(this.rootAttribute, this.scheme);
    },
  
    // Store scheme to local storage
    schemeToLocalStorage() {
      if (typeof window.localStorage !== "undefined") {
        window.localStorage.setItem(this.localStorageKey, this.scheme);
      }
    },
  };
  
  // Init
  themeSwitcher.init();
  
/*
 * Modal
 *
 * Pico.css - https://picocss.com
 * Copyright 2019-2023 - Licensed under MIT
 */

// Config
const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const animationDuration = 400; // ms
let visibleModal = null;

// Toggle modal
const toggleModal = (event) => {
  event.preventDefault();
  const modal = document.getElementById(event.currentTarget.getAttribute("data-target"));
  typeof modal != "undefined" && modal != null && isModalOpen(modal)
    ? closeModal(modal)
    : openModal(modal);
};

// Is modal open
const isModalOpen = (modal) => {
  return modal.hasAttribute("open") && modal.getAttribute("open") != "false" ? true : false;
};

// Open modal
const openModal = (modal) => {
  if (isScrollbarVisible()) {
    document.documentElement.style.setProperty("--scrollbar-width", `${getScrollbarWidth()}px`);
  }
  document.documentElement.classList.add(isOpenClass, openingClass);
  setTimeout(() => {
    visibleModal = modal;
    document.documentElement.classList.remove(openingClass);
  }, animationDuration);
  modal.setAttribute("open", true);
};

// Close modal
const closeModal = (modal) => {
  visibleModal = null;
  document.documentElement.classList.add(closingClass);
  setTimeout(() => {
    document.documentElement.classList.remove(closingClass, isOpenClass);
    document.documentElement.style.removeProperty("--scrollbar-width");
    modal.removeAttribute("open");
  }, animationDuration);
};

// Close with a click outside
document.addEventListener("click", (event) => {
  if (visibleModal != null) {
    const modalContent = visibleModal.querySelector("article");
    const isClickInside = modalContent.contains(event.target);
    !isClickInside && closeModal(visibleModal);
  }
});

// Close with Esc key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && visibleModal != null) {
    closeModal(visibleModal);
  }
});

// Get scrollbar width
const getScrollbarWidth = () => {
  // Creating invisible container
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll"; // forcing scrollbar to appear
  outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement("div");
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
};

// Is scrollbar visible
const isScrollbarVisible = () => {
  return document.body.scrollHeight > screen.height;
};