/* ----------------------------------------------------------------------------
   main.js — three small things: theme toggle, scroll-spy nav, mobile menu.
   No dependencies.
   -------------------------------------------------------------------------- */

(function () {
  "use strict";

  /* --------------------------------------------------------- dark mode -- */
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* private mode */ }
    });
  }

  /* ------------------------------------------------- navbar border state -- */
  var navbar = document.getElementById("navbar");
  function onScroll() {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------- mobile nav menu -- */
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    // Close the menu after tapping a section link on mobile.
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------- scroll-spy --- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
  }

  if (sections.length && "IntersectionObserver" in window) {
    var visible = new Map();

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        // Highlight whichever observed section currently occupies the most screen.
        var best = null;
        var bestRatio = 0;
        visible.forEach(function (ratio, id) {
          if (ratio > bestRatio) { bestRatio = ratio; best = id; }
        });

        if (best) setActive(best);
        else if (window.scrollY < 40) setActive("");   // back at the top: nothing active
      },
      { rootMargin: "-70px 0px -55% 0px", threshold: [0, 0.15, 0.4, 0.75, 1] }
    );

    sections.forEach(function (s) { observer.observe(s); });
  }
})();
