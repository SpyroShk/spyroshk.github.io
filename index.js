const NAV_BAR = document.getElementById("navBar");
const NAV_LIST = document.getElementById("navList");
const HERO_HEADER = document.getElementById("heroHeader");
const HAMBURGER_BTN = document.getElementById("hamburgerBtn");
const NAV_LINKS = Array.from(document.querySelectorAll(".nav__list-link"));
const SERVICE_BOXES = document.querySelectorAll(".service-card__box");
const ACTIVE_LINK_CLASS = "active";
const BREAKPOINT = 576;

let currentServiceBG = null;
let currentActiveLink = document.querySelector(".nav__list-link.active");

// Remove the active state once the breakpoint is reached
const resetActiveState = () => {
  NAV_LIST.classList.remove("nav--active");
  Object.assign(NAV_LIST.style, {
    height: null,
  });
  Object.assign(document.body.style, {
    overflowY: null,
  });
};

//Add padding to the header to make it visible because navbar has a fixed position.
const addPaddingToHeroHeaderFn = () => {
  const NAV_BAR_HEIGHT = NAV_BAR.getBoundingClientRect().height;
  const HEIGHT_IN_REM = NAV_BAR_HEIGHT / 10;

  // If hamburger button is active, do not add padding
  if (NAV_LIST.classList.contains("nav--active")) {
    return;
  }
  Object.assign(HERO_HEADER.style, {
    paddingTop: HEIGHT_IN_REM + "rem",
  });
};
addPaddingToHeroHeaderFn();
window.addEventListener("resize", () => {
  addPaddingToHeroHeaderFn();

  // When the navbar is active and the window is being resized, remove the active state once the breakpoint is reached
  if (window.innerWidth >= BREAKPOINT) {
    addPaddingToHeroHeaderFn();
    resetActiveState();
  }
});

// As the user scrolls, the active link should change based on the section currently displayed on the screen.
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll(
    "#heroHeader, #about, #services, #works, #contact"
  );

  // Loop through sections and check if they are visible
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const NAV_BAR_HEIGHT = NAV_BAR.getBoundingClientRect().height;
    if (window.scrollY >= sectionTop - NAV_BAR_HEIGHT) {
      const ID = section.getAttribute("id");
      const LINK = NAV_LINKS.filter((link) => {
        return link.href.includes("#" + ID);
      })[0];
      console.log(LINK);
      currentActiveLink.classList.remove(ACTIVE_LINK_CLASS);
      LINK.classList.add(ACTIVE_LINK_CLASS);
      currentActiveLink = LINK;
    }
  });
});

// Shows & hide navbar on smaller screen
HAMBURGER_BTN.addEventListener("click", () => {
  NAV_LIST.classList.toggle("nav--active");
  if (NAV_LIST.classList.contains("nav--active")) {
    Object.assign(document.body.style, {
      overflowY: "hidden",
    });
    Object.assign(NAV_LIST.style, {
      height: "100vh",
    });
    return;
  }
  Object.assign(NAV_LIST.style, {
    height: 0,
  });
  Object.assign(document.body.style, {
    overflowY: null,
  });
});

// When navbar link is clicked, reset the active state
NAV_LINKS.forEach((link) => {
  link.addEventListener("click", () => {
    resetActiveState();
    link.blur();
  });
});

// Handles the hover animation on services section
SERVICE_BOXES.forEach((service) => {
  const moveBG = (x, y) => {
    Object.assign(currentServiceBG.style, {
      left: x + "px",
      top: y + "px",
    });
  };
  service.addEventListener("mouseenter", (e) => {
    if (currentServiceBG === null) {
      currentServiceBG = service.querySelector(".service-card__bg");
    }
    moveBG(e.clientX, e.clientY);
  });
  service.addEventListener("mousemove", (e) => {
    const LEFT = e.clientX - service.getBoundingClientRect().left;
    const TOP = e.clientY - service.getBoundingClientRect().top;
    moveBG(LEFT, TOP);
  });
  service.addEventListener("mouseleave", () => {
    const IMG_POS = service.querySelector(".service-card__illustration");
    const LEFT =
      IMG_POS.offsetLeft + currentServiceBG.getBoundingClientRect().width;
    const TOP =
      IMG_POS.offsetTop + currentServiceBG.getBoundingClientRect().height;

    moveBG(LEFT, TOP);
    currentServiceBG = null;
  });
});

// Handles smooth scrolling
new SweetScroll({
  trigger: ".nav__list-link",
  easing: "easeOutQuint",
  offset: NAV_BAR.getBoundingClientRect().height - 80,
});

function checkScreenSize() {
  const leftSection = document.getElementById("leftSection");
  const rightSection = document.getElementById("rightSection");
  const leftSection2 = document.getElementById("leftSection2");
  const rightSection2 = document.getElementById("rightSection2");
  if (window.innerWidth < 768) {
    leftSection.parentNode.insertBefore(rightSection, leftSection);
    leftSection2.parentNode.insertBefore(rightSection2, leftSection2);
  } else {
    leftSection.parentNode.insertBefore(leftSection, rightSection);
    leftSection2.parentNode.insertBefore(leftSection2, rightSection2);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".fade-in-element");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    {
      threshold: 0.1, // Adjust this threshold value as needed
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
});

function sendMail(event) {
  event.preventDefault();

  const submitButton = document.getElementById("submitButton");
  submitButton.disabled = true;
  submitButton.innerHTML = "Sending...";

  let parms = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  emailjs
    .send("service_qzdpu48", "template_sg1mzuc", parms)
    .then(() => {
      alert("Email sent successfully!");
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("message").value = "";
    })
    .catch((error) => {
      console.error("Failed to send email:", error);
      alert("Failed to send email. Please try again later.");
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.innerHTML = "Submit";
    });
}
