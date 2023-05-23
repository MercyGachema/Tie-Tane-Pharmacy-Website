'use strict'; // This mode enforces stricter rules for variable declarations and other JavaScript behaviors.

// #Region Constants Selects elements from the document
const modal = document.querySelector('.modal'); //querySelector It is used to select and retrieve the first element that matches a specified CSS selector within the document
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height; // Uses the getBoundingClientRect() method to get the height of the nav element.
const headerObserver = new IntersectionObserver
(stickyNav, 
   {
  root: null,// Specifies the callback function that will be invoked when the observed element (in this case, header) intersects with the root element (specified as null)
  threshold: 0,// meaning the callback will be triggered as soon as the observed element enters the viewport
  rootMargin: `-${navHeight}px`, // set to -${navHeight}px, which adds a negative margin to the root element, effectively making 
  // the callback trigger when the observed element is 
   }
);

const allSections = document.querySelectorAll('.section'); // querySelectorAll method returns a NodeList, which is a collection of elements that match the specified selector
const sectionObserver = new IntersectionObserver
(revealSection, // define the actions to be taken when an observed section intersects with the root element, such as revealing or animating the section's content.
   {
  root: null,// indicates that the viewport is used as the root element. This means the intersection is calculated based on whether the observed elements are visible within the viewport.
  threshold: 0.15,// revealSection function will be called when the observed element is at least 15% visible within the viewport.
   }
);

const imgTargets = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver
(loadImages, 
   {
  root: null,
  threshold: 0,//the function will be triggered as soon as any part of the observed images enters the viewport.
  rootMargin: '200px',// there will be a 200-pixel margin added around the viewport
   }
);

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
const maxSlides = slides.length;
let currentSlide = 0;
// #EndRegion Constants

// #Region Event Listeners used to detect and respond to various events that occur in the web browser or on web elements.
btnCloseModal.addEventListener('click', closeModal);
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnScrollTo.addEventListener('click', scrollSectionIntoView);
document.addEventListener('keydown', closeModalOnEscPress);
overlay.addEventListener('click', closeModal);
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1)); // When the mouse is moved over the navigation menu, the handleHover function is 
//triggered with a bound parameter of either 0.5 or 1, indicating a hover effect.

document
  .querySelector('.nav__links')
  .addEventListener('click', scrollLinksIntoView);
tabsContainer.addEventListener('click', switchTabs);
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener
('keydown', function (e) // allows the user to navigate slides using the left and right arrow keys.
   {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
   }
);

dotContainer.addEventListener
('click', function (e) // allows the user to click on a dot to navigate to the corresponding slide
   {
     if (e.target.classList.contains('dots__dot')) // checks if the clicked target element has the CSS class 'dots__dot'. This is likely used to ensure that 
     //only clicks on the navigation dots trigger the desired behavior.
       {
         currentSlide = +e.target.dataset.slide; // his line assigns the value of the data-slide attribute of the clicked dot element to the currentSlide variable. 
         //The + sign before e.target.dataset.slide is used to convert the attribute value to a number
         goToSlide(currentSlide);
         activateDot(currentSlide); // used to visually highlight or indicate the active dot corresponding to the current slide.
       }
   }
);
// #EndRegion Event Listeners

// #Region Methods
headerObserver.observe(header); // sets up several observers

allSections.forEach
(section => 
   {
     sectionObserver.observe(section);
     section.classList.add('section--hidden');
   }
);

imgTargets.forEach(img => imgObserver.observe(img));

initialiseSlider(); // is responsible for setting up and initializing a slider component on the page
// #EndRegion Methods

// #Region Functions
function openModal(e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}

function closeModalOnEscPress(e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
}

function switchTabs(e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
}

function handleHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(function (el) {
      if (el !== link) {
        el.style.opacity = this;
        logo.style.opacity = this;
      }
    }, this);
  }
}

function scrollLinksIntoView(e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollSectionIntoView(e) {
  section1.scrollIntoView({ behavior: 'smooth' });
}

function stickyNav(entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

function revealSection(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

function loadImages(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}
// #EndRegion Functions

function initialiseSlider() {
  goToSlide(0);
  createDots();
  activateDot(0);
}

function activateDot(slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
}

function createDots() {
  slides.forEach((_, index) =>
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`
    )
  );
}

function goToSlide(slide) {
  slides.forEach(
    (slide, index) =>
      (slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`)
  );
}

function nextSlide() {
  if (currentSlide === maxSlides - 1) currentSlide = 0;
  else currentSlide++;

  goToSlide(currentSlide);
  activateDot(currentSlide);
}

function prevSlide() {
  if (currentSlide === 0) currentSlide = maxSlides - 1;
  else currentSlide--;
  goToSlide(currentSlide);
  activateDot(currentSlide);
}

