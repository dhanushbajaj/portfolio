/* ============================================================
   PORTFOLIO SCRIPT
   Handles: mobile menu, navbar scroll state, scroll progress,
   active-section highlighting, scroll-reveal animations,
   project filtering, and contact-form validation.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Cache DOM references ---------- */
  const navbar       = document.getElementById("navbar");
  const navLinks     = document.getElementById("navLinks");
  const hamburger    = document.getElementById("hamburger");
  const links        = document.querySelectorAll(".nav-link");
  const sections      = document.querySelectorAll("main section[id]");
  const progressBar  = document.getElementById("scrollProgress");

  /* ============================================================
     1. MOBILE HAMBURGER MENU TOGGLE
     ============================================================ */
  function toggleMenu() {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    // Prevent body scroll while the drawer is open
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  hamburger.addEventListener("click", toggleMenu);

  // Close the menu whenever a nav link is tapped (mobile)
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      if (navLinks.classList.contains("open")) toggleMenu();
    });
  });

  /* ============================================================
     2. NAVBAR SCROLL STATE + SCROLL PROGRESS BAR
     ============================================================ */
  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Solid/blurred navbar after scrolling a bit
    navbar.classList.toggle("scrolled", scrollTop > 30);

    // Reading-progress bar width
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load

  /* ============================================================
     3. ACTIVE SECTION HIGHLIGHTING
     Uses IntersectionObserver to flag the section currently
     in view, then highlights its matching nav link.
     ============================================================ */
  const navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          links.forEach(function (link) {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + id
            );
          });
        }
      });
    },
    {
      // Trigger when a section is roughly centered in the viewport
      rootMargin: "-45% 0px -50% 0px",
      threshold: 0,
    }
  );
  sections.forEach(function (section) {
    navObserver.observe(section);
  });

  /* ============================================================
     4. SCROLL-REVEAL ANIMATIONS
     Reveals .reveal elements as they enter the viewport, with a
     small stagger for groups of cards.
     ============================================================ */
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          // Stagger siblings slightly for a nicer cascade
          const delay = Math.min(index * 80, 240);
          setTimeout(function () {
            entry.target.classList.add("visible");
          }, delay);
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ============================================================
     5. PROJECT FILTERING
     Each project card has data-category (space-separated tags).
     Clicking a filter shows matching cards and hides the rest.
     ============================================================ */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards  = document.querySelectorAll(".project-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Update active button styling
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      projectCards.forEach(function (card) {
        const categories = card.getAttribute("data-category") || "";
        const matches = filter === "all" || categories.indexOf(filter) !== -1;

        if (matches) {
          card.classList.remove("hide");
          // Re-trigger the reveal animation for a smooth re-entry
          card.classList.remove("visible");
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              card.classList.add("visible");
            });
          });
        } else {
          card.classList.add("hide");
        }
      });
    });
  });

  /* ============================================================
     6. CONTACT FORM VALIDATION
     Lightweight client-side validation; ready to wire to a real
     backend / email service later.
     ============================================================ */
  const form     = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  if (form) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let valid = true;

      // Validate each required field
      form.querySelectorAll("[required]").forEach(function (field) {
        const value = field.value.trim();
        let fieldOk = value !== "";

        // Extra check for the email field
        if (field.type === "email" && value !== "") {
          fieldOk = emailPattern.test(value);
        }

        field.classList.toggle("invalid", !fieldOk);
        if (!fieldOk) valid = false;
      });

      if (!valid) {
        formNote.textContent = "Please fill in all fields with a valid email.";
        formNote.className = "form-note error";
        return;
      }

      // Success — here you'd POST to your backend / email API
      formNote.textContent = "Thanks! Your message has been sent. ✅";
      formNote.className = "form-note success";
      form.reset();

      // Clear the note after a few seconds
      setTimeout(function () {
        formNote.textContent = "";
        formNote.className = "form-note";
      }, 5000);
    });

    // Clear the invalid state as the user types
    form.querySelectorAll("[required]").forEach(function (field) {
      field.addEventListener("input", function () {
        field.classList.remove("invalid");
      });
    });
  }

  /* ============================================================
     7. FOOTER YEAR
     ============================================================ */
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

})();
