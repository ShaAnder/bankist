'use strict';

// SELECT ELEMENTS

// Overlay
const overlay = document.querySelector('.overlay');
// Navbar
const nav = document.querySelector('.nav');

// Modal window
const modal = document.querySelector('.modal');
// Open / Close Modal
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// FUNCTIONS

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// MAIN BODY

// Open and close modal window
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// NAV SCROLLING
const scrollNav = function () {
  const section1 = document.querySelector('#section--1');
  const btnScrollTo = document.querySelector('.btn--scroll-to');
  document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      const idCoords = document.querySelector(id).getBoundingClientRect();

      window.scrollTo({
        left: idCoords.left + window.pageXOffset,
        top: idCoords.top + window.pageYOffset,
        behavior: 'smooth',
      });
    }
  });

  btnScrollTo.addEventListener('click', function (e) {
    section1.scrollIntoView({ behavior: 'smooth' });
  });
};
scrollNav();

// TABS CONTAINER
const tabContainer = function () {
  const tabs = document.querySelectorAll('.operations__tab');
  const tabsContainer = document.querySelector('.operations__tab-container');
  const tabsContent = document.querySelectorAll('.operations__content');

  tabsContainer.addEventListener('click', function (e) {
    // Look for closest element to tab
    const clicked = e.target.closest('.operations__tab');

    // Guard Clause
    if (!clicked) return;

    // Remove Active classes
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));

    // Activate clicked tab
    clicked.classList.add('operations__tab--active');

    // Activate Content Area
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });
};
tabContainer();
// FADE IN NAV ANIMATION

const fadeInButtons = function () {
  const handleHover = function (e) {
    if (!e.target.classList.contains('nav__link')) return; // we guard in case it can't be found

    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  };

  // Passing "argument" into handler
  nav.addEventListener('mouseover', handleHover.bind(0.5));
  nav.addEventListener('mouseout', handleHover.bind(1));
};
fadeInButtons();
// STICKY NAV BAR

const stickyNav = function () {
  const header = document.querySelector('.header');
  const navHeight = nav.getBoundingClientRect().height;

  const sticky = function (entries) {
    const [entry] = entries;
    console.log(entry);
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  };

  const headerObserver = new IntersectionObserver(sticky, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });

  headerObserver.observe(header);
};
stickyNav();

// REVEAL SECTIONS
const revealSections = function () {
  const allSections = document.querySelectorAll('.section');

  const reveal = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  };

  const sectionObserver = new IntersectionObserver(reveal, {
    root: null,
    threshold: 0.25,
  });

  allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
  });
};

revealSections();
// LAZYLOADING IMAGES FOR OPTIMIZATION

const lazyLoad = function () {
  const imgTargets = document.querySelectorAll('img[data-src]');

  const loadImg = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  };

  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '-200px',
  });

  imgTargets.forEach(img => imgObserver.observe(img));
};
lazyLoad();

const slider = function () {
  // selectors
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  //Variables
  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  createDots();

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - curSlide)}%)`)
    );
  };
  goToSlide(0);

  const nextSlide = function () {
    if (curSlide == maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      curSlide = +e.target.dataset.slide;
      goToSlide(slide);
      activateDot(curSlide);
    }
  });
};
slider();
