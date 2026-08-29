const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const navLinksContainer = document.querySelector(".nav-links");

const navLinks = document.querySelectorAll(
  '.nav-links a[href^="#"]'
);

const sections = document.querySelectorAll(
  "main section[id]"
);

const newsSection = document.querySelector("#news");
const newsList = document.querySelector(".news-list");
const newsDetails = document.querySelector(".news-details");
const newsDetailArticles = document.querySelectorAll("[data-news-detail]");
const newsLinks = document.querySelectorAll("[data-news-link]");
const newsBackButtons = document.querySelectorAll("[data-news-back]");

const NEWS_SCROLL_KEY = "anceshyeon-news-scroll-y";
let newsListScrollY = Number(sessionStorage.getItem(NEWS_SCROLL_KEY)) || 0;


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
   뉴스 목록과 상세 화면 전환
-------------------------------------------------- */
function getNewsArticleId() {
  const match = window.location.hash.match(/^#news\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function showNewsList(restoreScroll = false) {
  if (!newsList || !newsDetails) return;

  newsList.hidden = false;
  newsDetails.hidden = true;
  newsDetailArticles.forEach((article) => {
    article.hidden = true;
  });

  if (restoreScroll) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: newsListScrollY, behavior: "auto" });
      });
    });
  }
}

function showNewsArticle(articleId) {
  if (!newsList || !newsDetails || !newsSection) return;

  const article = document.querySelector(
    `[data-news-detail="${CSS.escape(articleId)}"]`
  );

  if (!article) {
    showNewsList();
    return;
  }

  newsList.hidden = true;
  newsDetails.hidden = false;
  newsDetailArticles.forEach((item) => {
    item.hidden = item !== article;
  });

  const headerHeight = header ? header.offsetHeight : 0;
  window.scrollTo({
    top: newsSection.offsetTop - headerHeight,
    behavior: "auto"
  });
}

function handleNewsRoute() {
  const articleId = getNewsArticleId();

  if (articleId) {
    showNewsArticle(articleId);
  } else {
    const wasShowingArticle = newsDetails && !newsDetails.hidden;
    showNewsList(wasShowingArticle);
  }

  updateActiveNavigation();
}

newsLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    newsListScrollY = window.scrollY;
    sessionStorage.setItem(NEWS_SCROLL_KEY, String(newsListScrollY));

    window.history.replaceState(null, "", "#news");
    window.history.pushState(
      { newsArticle: link.dataset.newsLink },
      "",
      link.getAttribute("href")
    );
    handleNewsRoute();
  });
});

newsBackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (window.history.state?.newsArticle) {
      window.history.back();
    } else {
      window.location.hash = "news";
    }
  });
});

window.addEventListener("hashchange", handleNewsRoute);
window.addEventListener("popstate", handleNewsRoute);


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
  handleNewsRoute();
});
