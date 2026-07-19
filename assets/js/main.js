const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const navLinksContainer = document.querySelector(".nav-links");

const navLinks = document.querySelectorAll(
  '.nav-links a[href^="#"]'
);

const sections = document.querySelectorAll(
  "main section[id]"
);


/* --------------------------------------------------
   헤더 그림자
-------------------------------------------------- */
function updateHeader() {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}


/* --------------------------------------------------
   현재 섹션에 맞춰 메뉴 active 변경
-------------------------------------------------- */
function updateActiveNavigation() {
  const headerHeight = header.offsetHeight;
  const scrollPosition = window.scrollY + headerHeight + 80;

  let currentSectionId = "home";

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href").replace("#", "");

    if (targetId === currentSectionId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}


/* --------------------------------------------------
   모바일 메뉴 열기·닫기
-------------------------------------------------- */
if (menuButton && navLinksContainer) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinksContainer.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });
}


/* --------------------------------------------------
   메뉴 클릭 시 모바일 메뉴 닫기
-------------------------------------------------- */
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinksContainer) {
      navLinksContainer.classList.remove("open");
    }

    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
});


/* --------------------------------------------------
   현재 연도 표시
-------------------------------------------------- */
const currentYearElement = document.querySelector(
  "[data-current-year]"
);

if (currentYearElement) {
  currentYearElement.textContent = new Date().getFullYear();
}


/* --------------------------------------------------
   스크롤 및 페이지 로드 이벤트
-------------------------------------------------- */
function handleScroll() {
  updateHeader();
  updateActiveNavigation();
}

window.addEventListener("scroll", handleScroll);

window.addEventListener("resize", () => {
  updateActiveNavigation();
});

window.addEventListener("DOMContentLoaded", () => {
  updateHeader();
  updateActiveNavigation();
});