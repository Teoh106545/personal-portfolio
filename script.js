
"use strict";

// ================= 1. MOBILE NAVIGATION =================

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close the mobile menu after selecting a navigation link.
navItems.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
    });
});


// ================= 2. DARK / LIGHT THEME =================

const themeToggle = document.getElementById("theme-toggle");

function updateThemeButton() {
    const isLight = document.body.classList.contains("light-theme");

    themeToggle.textContent = isLight ? "☾" : "☀";
    themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
    );
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    const isLight = document.body.classList.contains("light-theme");

    // Save the preference for the next visit.
    try {
        localStorage.setItem(
            "portfolio-theme",
            isLight ? "light" : "dark"
        );
    } catch (error) {
        // The theme still works if browser storage is unavailable.
    }

    updateThemeButton();
});

// Restore the saved theme when possible.
try {
    if (localStorage.getItem("portfolio-theme") === "light") {
        document.body.classList.add("light-theme");
    }
} catch (error) {
    // Use the default theme if browser storage is unavailable.
}

updateThemeButton();

// ================= 3. PROJECT FILTERING =================

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((item) => {
            const selected = item === button;

            item.classList.toggle("active", selected);
            item.setAttribute("aria-pressed", String(selected));
        });

        filterProjects();
    });
});;

// ================= 4. SCROLL REVEAL ANIMATION =================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");

                    // Reveal each element only once.
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    // Fallback for browsers without IntersectionObserver.
    revealElements.forEach((element) => {
        element.classList.add("show");
    });
}


// ================= 5. ACTIVE NAVIGATION LINK =================

const pageSections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;

                    navItems.forEach((link) => {
                        const isActive =
                            link.getAttribute("href") === `#${sectionId}`;

                        link.classList.toggle("active", isActive);
                    });
                }
            });
        },
        {
            rootMargin: "-30% 0px -60% 0px"
        }
    );

    pageSections.forEach((section) => {
        sectionObserver.observe(section);
    });
}


// ================= 6. BACK TO TOP BUTTON =================

const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth"
    });
});


// ================= 7. CONTACT FORM =================

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

// Replace this with your real email address.
const portfolioEmail = "106545@siswa.unimas.my";

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
        return;
    }

    const name = document.getElementById("visitor-name").value.trim();
    const email = document.getElementById("visitor-email").value.trim();
    const message = document.getElementById("visitor-message").value.trim();

    if (!name || !email || !message) {
        formStatus.textContent = "Please complete all fields.";
        return;
    }

    // Encode user input so it can safely be placed in a mailto URL.
    const subject = encodeURIComponent(
        `Portfolio enquiry from ${name}`
    );

    const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    formStatus.textContent =
        "Opening your email application. Please send the message there.";

    // This front-end form opens the visitor's email application.
    // It does not send or store messages on its own.
    window.location.href =
        `mailto:${portfolioEmail}?subject=${subject}&body=${body}`;
});


// ================= 8. AUTOMATIC FOOTER YEAR =================

document.getElementById("current-year").textContent =
    new Date().getFullYear();


/* ================= 9. LIVE PROJECT SEARCH ================= */

const projectSearchInput =
    document.getElementById("project-search-input");

const projectSearchStatus =
    document.getElementById("project-search-status");

function filterProjects() {
    // Read the current category selected by the visitor.
    const activeFilter = document.querySelector(
        ".filter-btn.active"
    );

    const selectedCategory = activeFilter
        ? activeFilter.dataset.filter
        : "all";

    const searchTerm = projectSearchInput.value
        .trim()
        .toLowerCase();

    let visibleCount = 0;

    projectCards.forEach((card) => {
        const matchesCategory =
            selectedCategory === "all" ||
            card.dataset.category === selectedCategory;

        // Search the project title, description and technology tags.
        const matchesSearch = card.textContent
            .toLowerCase()
            .includes(searchTerm);

        const isVisible = matchesCategory && matchesSearch;

        card.hidden = !isVisible;

        if (isVisible) {
            visibleCount++;
        }
    });

    projectSearchStatus.textContent =
        `${visibleCount} project${visibleCount === 1 ? "" : "s"} found.`;
}

projectSearchInput.addEventListener("input", filterProjects);

/* ================= 10. COPY EMAIL ADDRESS ================= */

const copyEmailButton = document.getElementById("copy-email");
const copyEmailStatus = document.getElementById("copy-email-status");

let copyMessageTimeout;

copyEmailButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(portfolioEmail);

        copyEmailStatus.textContent = "Email address copied.";

        // Reset the timer if the button is clicked again
        clearTimeout(copyMessageTimeout);

        // Hide the message after 3 seconds
        copyMessageTimeout = setTimeout(() => {
            copyEmailStatus.textContent = "";
        }, 3000);

    } catch (error) {
        copyEmailStatus.textContent =
            "Copy failed. Please copy the email manually.";

        clearTimeout(copyMessageTimeout);

        copyMessageTimeout = setTimeout(() => {
            copyEmailStatus.textContent = "";
        }, 3000);
    }
});

// Reapply the search whenever a category filter is clicked.
filterButtons.forEach((button) => {
    button.addEventListener("click", filterProjects);
});
