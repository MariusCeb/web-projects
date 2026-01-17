window.addEventListener("DOMContentLoaded", () => {
  // --- GSAP initial state ---
  gsap.set("nav", { y: -100 });
  gsap.set(".letter-wrapper", { y: 400 });
  gsap.set(".header", { scale: 1.2 });
  gsap.set(".background-image", { opacity: 0, scale: 1.1 });
  gsap.defaults({ duration: 1, ease: "power3.out" });

  // --- Intro timeline (now: BG first, then red box) ---
  const tl = gsap.timeline({ paused: true, delay: 0.5 });

  tl.to(".letter-wrapper", { y: 0, stagger: 0.1 })
    .to(".header", { scale: 1, duration: 0.8 })
    .to(".header-item-1", { x: -200, opacity: 0, duration: 1.2, ease: "power3.inOut" }, "+=0.1")
    .to(".header-item-2", { x: 200, opacity: 0, duration: 1.2, ease: "power3.inOut" }, "<")
    .addLabel("textGone")

    // 1) Bring in the background first
    .to(".background-image", {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: "power2.out"
    }, "+=0.1")
    .addLabel("bgIn")

    // 2) THEN open the red box
    .to(".item-main .item-img img", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      duration: 1.1
    }, "bgIn+=0.2") // slight offset after BG starts/finishes; adjust if you want
    .to(".item-main .item-img img", { scale: 1 }, "<")

    // 3) Nav enters
    .to("nav", { y: 0, duration: 0.8 }, "-=0.1");

  tl.play();

  // --- Mobile menu ---
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");

  const setHamburgerState = (active) => {
    if (!mobileMenuToggle) return;
    const [line1, line2, line3] = mobileMenuToggle.querySelectorAll("span");
    if (!line1 || !line2 || !line3) return;
    if (active) {
      line1.style.transform = "rotate(45deg) translate(5px, 5px)";
      line2.style.opacity = "0";
      line3.style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      line1.style.transform = "none";
      line2.style.opacity = "1";
      line3.style.transform = "none";
    }
  };

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      setHamburgerState(mobileMenu.classList.contains("active"));
    });
    mobileMenuLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        setHamburgerState(false);
      });
    });
  }

  // Nav scroll effect
  window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    if (window.scrollY > 50) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  });

  // Gallery entrance animation on scroll
  const galleryItems = document.querySelectorAll(".gallery-item");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  galleryItems.forEach(item => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";
    item.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(item);
  });

  // ---------------------------
  // Lightbox (Gallery Viewer)
  // ---------------------------
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const counterEl = document.getElementById("lightbox-counter");
  const btnClose = lightbox.querySelector(".lb-close");
  const btnPrev  = lightbox.querySelector(".lb-prev");
  const btnNext  = lightbox.querySelector(".lb-next");

  const thumbs = Array.from(document.querySelectorAll(".gallery-item img"));
  let currentIndex = 0;
  let touchStartX = 0;

  const updateCounter = () => {
    counterEl.textContent = `${currentIndex + 1} / ${thumbs.length}`;
  };

  const preload = (idx) => {
    const el = thumbs[(idx + thumbs.length) % thumbs.length];
    if (!el) return;
    const url = el.getAttribute("src");
    const img = new Image();
    img.src = url;
  };

  const showImage = (idx) => {
    currentIndex = (idx + thumbs.length) % thumbs.length;
    const src = thumbs[currentIndex].getAttribute("src");
    const alt = thumbs[currentIndex].getAttribute("alt") || "";
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    updateCounter();
    preload(currentIndex + 1);
    preload(currentIndex - 1);
  };

  const openLightbox = (idx) => {
    showImage(idx);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => { lightboxImg.src = ""; }, 200);
  };

  const next = () => showImage(currentIndex + 1);
  const prev = () => showImage(currentIndex - 1);

  thumbs.forEach((img, idx) => {
    img.addEventListener("click", () => openLightbox(idx));
    img.style.cursor = "zoom-in";
  });

  btnClose.addEventListener("click", closeLightbox);
  btnNext.addEventListener("click", next);
  btnPrev.addEventListener("click", prev);

  lightbox.addEventListener("click", (e) => {
    const isBackdrop = e.target === lightbox;
    const isContent = e.target.classList.contains("lb-content");
    if (isBackdrop || isContent) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  }, { passive: true });
});
