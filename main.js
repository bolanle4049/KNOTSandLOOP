// class Carousel {
//   constructor(options) {
//     this.track = document.getElementById(options.trackId);
//     this.container = document.getElementById(options.containerId);

//     // Guard: if elements don't exist on this page, do nothing
//     if (!this.track || !this.container) return;

//     this.cards = Array.from(this.track.children);
//     if (this.cards.length === 0) return;

//     this.prevBtn = document.querySelector(options.prevBtn);
//     this.nextBtn = document.querySelector(options.nextBtn);
//     this.dots = options.dots ? Array.from(document.querySelectorAll(options.dots)) : null;
//     this.autoSlideTime = options.autoSlideTime || 3000;
//     this.isVideo = options.isVideo || false;

//     this.cloneCount = options.cloneCount || 2;
//     this.currentIndex = this.cloneCount;
//     this.cardWidth = this.cards[0].offsetWidth + 20;

//     this.autoSlide = null;
//     this.startX = 0;
//     this.isDragging = false;

//     this.init();
//   }

//   init() {
//     this.cloneCards();
//     this.cards = Array.from(this.track.children);
//     this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + this.container.offsetWidth / 2 - this.cardWidth / 2}px)`;

//     this.updateActive();
//     this.attachEvents();
//     this.startAutoSlide();

//     if (this.isVideo) this.playSnippet(this.currentIndex);
//   }

//   cloneCards() {
//     for (let i = 0; i < this.cloneCount; i++) {
//       const firstClone = this.cards[i].cloneNode(true);
//       firstClone.classList.add('clone');
//       this.track.appendChild(firstClone);

//       const lastClone = this.cards[this.cards.length - 1 - i].cloneNode(true);
//       lastClone.classList.add('clone');
//       this.track.insertBefore(lastClone, this.track.firstChild);
//     }
//   }

//   updateActive() {
//     this.cards.forEach(c => c.classList.remove('active'));
//     if (this.cards[this.currentIndex]) {
//       this.cards[this.currentIndex].classList.add('active');
//     }

//     if (!this.dots) return;

//     let activeOriginal = this.currentIndex - this.cloneCount;
//     const totalOriginal = this.cards.length - this.cloneCount * 2;
//     if (activeOriginal < 0) activeOriginal = totalOriginal + activeOriginal;
//     if (activeOriginal >= totalOriginal) activeOriginal -= totalOriginal;

//     this.dots.forEach(d => d.classList.remove('active'));
//     if (this.dots[activeOriginal]) {
//       this.dots[activeOriginal].classList.add('active');
//     }
//   }

//   moveToIndex(index) {
//     this.currentIndex = index;
//     this.track.style.transition = 'transform 0.5s ease';
//     this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + this.container.offsetWidth / 2 - this.cardWidth / 2}px)`;
//     this.updateActive();
//     if (this.isVideo) this.playSnippet(this.currentIndex);
//   }

//   moveNext() {
//     this.currentIndex++;
//     this.track.style.transition = 'transform 0.5s ease';
//     this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + this.container.offsetWidth / 2 - this.cardWidth / 2}px)`;
//     this.updateActive();
//     this.track.addEventListener('transitionend', () => this.checkLoop(), { once: true });
//     if (this.isVideo) this.playSnippet(this.currentIndex);
//   }

//   movePrev() {
//     this.currentIndex--;
//     this.track.style.transition = 'transform 0.5s ease';
//     this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + this.container.offsetWidth / 2 - this.cardWidth / 2}px)`;
//     this.updateActive();
//     this.track.addEventListener('transitionend', () => this.checkLoop(), { once: true });
//     if (this.isVideo) this.playSnippet(this.currentIndex);
//   }

//   checkLoop() {
//     if (!this.cards[this.currentIndex]) return;
//     if (this.cards[this.currentIndex].classList.contains('clone')) {
//       this.track.style.transition = 'none';
//       if (this.currentIndex < this.cloneCount) {
//         this.currentIndex = this.cards.length - this.cloneCount * 2 + this.currentIndex;
//       } else {
//         this.currentIndex = this.currentIndex - (this.cards.length - this.cloneCount * 2);
//       }
//       this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + this.container.offsetWidth / 2 - this.cardWidth / 2}px)`;
//       this.updateActive();
//     }
//   }

//   startAutoSlide() {
//     this.autoSlide = setInterval(() => this.moveNext(), this.autoSlideTime);
//   }

//   stopAutoSlide() {
//     clearInterval(this.autoSlide);
//   }

//   attachEvents() {
//     // Buttons
//     if (this.nextBtn) this.nextBtn.addEventListener('click', () => { this.moveNext(); this.stopAutoSlide(); this.startAutoSlide(); });
//     if (this.prevBtn) this.prevBtn.addEventListener('click', () => { this.movePrev(); this.stopAutoSlide(); this.startAutoSlide(); });

//     // Dots
//     if (this.dots) {
//       this.dots.forEach((dot, idx) => {
//         dot.addEventListener('click', () => this.moveToIndex(idx + this.cloneCount));
//       });
//     }

//     // Hover pause
//     this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
//     this.container.addEventListener('mouseleave', () => this.startAutoSlide());

//     // Swipe/touch support
//     this.container.addEventListener('touchstart', e => {
//       this.startX = e.touches[0].clientX;
//       this.isDragging = true;
//       this.stopAutoSlide();
//     });

//     this.container.addEventListener('touchmove', e => {
//       if (!this.isDragging) return;
//       const x = e.touches[0].clientX;
//       const diff = x - this.startX;
//       this.track.style.transition = 'none';
//       this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + this.container.offsetWidth / 2 - this.cardWidth / 2 + diff}px)`;
//     });

//     this.container.addEventListener('touchend', e => {
//       this.isDragging = false;
//       const endX = e.changedTouches[0].clientX;
//       const diff = endX - this.startX;
//       if (diff < -50) this.moveNext();
//       else if (diff > 50) this.movePrev();
//       else this.moveToIndex(this.currentIndex);
//       this.startAutoSlide();
//     });

//     // Resize handling
//     window.addEventListener('resize', () => {
//       if (!this.cards[0]) return;
//       this.cardWidth = this.cards[0].offsetWidth + 20;
//       this.track.style.transition = 'none';
//       this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + this.container.offsetWidth / 2 - this.cardWidth / 2}px)`;
//     });
//   }

//   // Video snippet support
//   playSnippet(index) {
//     if (!this.isVideo) return;
//     this.cards.forEach(card => {
//       const video = card.querySelector('video');
//       if (video) { video.pause(); video.currentTime = 0; }
//     });
//     const activeVideo = this.cards[index] && this.cards[index].querySelector('video');
//     if (activeVideo) {
//       activeVideo.play();
//       setTimeout(() => activeVideo.pause(), 3000);
//     }
//   }
// }

// // ==========================================
// // INITIALISE CAROUSELS (only if elements exist)
// // ==========================================
// document.addEventListener('DOMContentLoaded', function () {

//   // PRODUCT CAROUSEL (home page)
//   if (document.getElementById('carousel_track')) {
//     new Carousel({
//       trackId: 'carousel_track',
//       containerId: 'carousel_container',
//       prevBtn: '.carousel_btn.prev',
//       nextBtn: '.carousel_btn.next',
//       dots: '.carousel_dot',
//       autoSlideTime: 3000
//     });
//   }

//   // TUTORIAL CAROUSEL (home page)
//   if (document.getElementById('tutorial-track')) {
//     new Carousel({
//       trackId: 'tutorial-track',
//       containerId: 'tutorial-container',
//       prevBtn: '.tutorial-btn.prev',
//       nextBtn: '.tutorial-btn.next',
//       autoSlideTime: 5000,
//       isVideo: true
//     });
//   }

//   // ==========================================
//   // HERO IMAGE CAROUSEL (home page)
//   // ==========================================
//   const heroImages = document.querySelectorAll('.hero-img');
//   const heroDots = document.querySelectorAll('.hero-dot');
//   let heroCurrent = 0;

//   function showSlide(index) {
//     heroImages.forEach((img, i) => {
//       img.classList.remove('active');
//       if (heroDots[i]) heroDots[i].classList.remove('active');
//     });
//     heroImages[index].classList.add('active');
//     if (heroDots[index]) heroDots[index].classList.add('active');
//     heroCurrent = index;
//   }

//   if (heroImages.length > 1) {
//     heroDots.forEach(dot => {
//       dot.addEventListener('click', () => {
//         clearInterval(heroInterval);
//         showSlide(parseInt(dot.getAttribute('data-index')));
//         heroInterval = setInterval(nextHeroSlide, 4000);
//       });
//     });

//     function nextHeroSlide() {
//       showSlide((heroCurrent + 1) % heroImages.length);
//     }

//     var heroInterval = setInterval(nextHeroSlide, 4000);
//     showSlide(0);
//   }

//   // ==========================================
//   // HAMBURGER MENU
//   // ==========================================
//   const hamburger = document.getElementById('hamburger');
//   const navMenu = document.querySelector('.navbarcont');

//   if (hamburger && navMenu) {
//     const overlay = document.createElement('div');
//     overlay.classList.add('menu-overlay');
//     document.body.appendChild(overlay);

//     hamburger.addEventListener('click', (e) => {
//       e.preventDefault();
//       hamburger.classList.toggle('active');
//       navMenu.classList.toggle('active');
//       overlay.classList.toggle('active');
//       document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
//     });

//     overlay.addEventListener('click', () => {
//       hamburger.classList.remove('active');
//       navMenu.classList.remove('active');
//       overlay.classList.remove('active');
//       document.body.style.overflow = '';
//     });

//     document.querySelectorAll('.nav-link').forEach(link => {
//       link.addEventListener('click', () => {
//         hamburger.classList.remove('active');
//         navMenu.classList.remove('active');
//         overlay.classList.remove('active');
//         document.body.style.overflow = '';
//       });
//     });

//     window.addEventListener('resize', () => {
//       if (window.innerWidth > 1200) {
//         hamburger.classList.remove('active');
//         navMenu.classList.remove('active');
//         overlay.classList.remove('active');
//         document.body.style.overflow = '';
//       }
//     });
//   }

// });







// const track = document.getElementById('carousel_track');
// const container = document.getElementById('carousel_container');
// let cards = Array.from(track.children);
// const prevBtn = document.querySelector('.prev');
// const nextBtn = document.querySelector('.next');
// const dots = Array.from(document.querySelectorAll('.carousel_dot'));

// let cardWidth = cards[0].offsetWidth + 20;
// let currentIndex = 0;
// let autoSlide;
// const intervalTime = 3000;

// // CLONE for seamless infinite
// const cloneCount = 2;
// for(let i = 0; i < cloneCount; i++){
//   const firstClone = cards[i].cloneNode(true);
//   firstClone.classList.add('clone');
//   track.appendChild(firstClone);

//   const lastClone = cards[cards.length - 1 - i].cloneNode(true);
//   lastClone.classList.add('clone');
//   track.insertBefore(lastClone, track.firstChild);
// }

// cards = Array.from(track.children);
// currentIndex = cloneCount;
// track.style.transform = `translateX(${-currentIndex * cardWidth + container.offsetWidth/2 - cardWidth/2}px)`;

// // FUNCTION TO UPDATE ACTIVE CARD AND DOTS
// function updateActive() {
//   cards.forEach(c => c.classList.remove('active'));
//   cards[currentIndex].classList.add('active');

//   let activeOriginal = currentIndex - cloneCount;
//   if(activeOriginal < 0) activeOriginal = cards.length - cloneCount*2 + activeOriginal;
//   if(activeOriginal >= cards.length - cloneCount*2) activeOriginal -= cards.length - cloneCount*2;

//   dots.forEach(d => d.classList.remove('active'));
//   dots[activeOriginal].classList.add('active');
// }

// // FUNCTION TO MOVE TO INDEX
// function moveToIndex(index) {
//   currentIndex = index;
//   track.style.transition = 'transform 0.5s ease';
//   track.style.transform = `translateX(${-currentIndex * cardWidth + container.offsetWidth/2 - cardWidth/2}px)`;
//   updateActive();
// }

// // NEXT / PREV
// function moveNext() {
//   currentIndex++;
//   track.style.transition = 'transform 0.5s ease';
//   track.style.transform = `translateX(${-currentIndex * cardWidth + container.offsetWidth/2 - cardWidth/2}px)`;
//   updateActive();
//   track.addEventListener('transitionend', checkLoop);
// }

// function movePrev() {
//   currentIndex--;
//   track.style.transition = 'transform 0.5s ease';
//   track.style.transform = `translateX(${-currentIndex * cardWidth + container.offsetWidth/2 - cardWidth/2}px)`;
//   updateActive();
//   track.addEventListener('transitionend', checkLoop);
// }

// // CHECK LOOP
// function checkLoop() {
//   track.removeEventListener('transitionend', checkLoop);
//   if(cards[currentIndex].classList.contains('clone')){
//     track.style.transition = 'none';
//     if(currentIndex < cloneCount){
//       currentIndex = cards.length - cloneCount*2 + currentIndex;
//     } else {
//       currentIndex = currentIndex - (cards.length - cloneCount*2);
//     }
//     track.style.transform = `translateX(${-currentIndex * cardWidth + container.offsetWidth/2 - cardWidth/2}px)`;
//     updateActive();
//   }
// }

// // DOTS CLICK
// dots.forEach((dot, idx) => {
//   dot.addEventListener('click', () => {
//     moveToIndex(idx + cloneCount);
//   });
// });

// // AUTO SLIDE
// function startAutoSlide(){
//   autoSlide = setInterval(moveNext, intervalTime);

// }

// function stopAutoSlide(){
//   clearInterval(autoSlide);
// }

// // ARROWS
// nextBtn.addEventListener('click', () => { moveNext(); stopAutoSlide(); startAutoSlide(); });
// prevBtn.addEventListener('click', () => { movePrev(); stopAutoSlide(); startAutoSlide(); });

// // PAUSE ON HOVER
// container.addEventListener('mouseenter', stopAutoSlide);
// container.addEventListener('mouseleave', startAutoSlide);

// // RESIZE HANDLING
// window.addEventListener('resize', () => {
//   cardWidth = cards[0].offsetWidth + 20;
//   track.style.transition = 'none';
//   track.style.transform = `translateX(${-currentIndex * cardWidth + container.offsetWidth/2 - cardWidth/2}px)`;
// });

// // SWIPE SUPPORT
// let startX = 0;
// let isDragging = false;

// container.addEventListener('touchstart', e => {
//   startX = e.touches[0].clientX;
//   isDragging = true;
//   stopAutoSlide();
// });

// container.addEventListener('touchmove', e => {
//   if(!isDragging) return;
//   const x = e.touches[0].clientX;
//   const diff = x - startX;
//   track.style.transition = 'none';
//   track.style.transform = `translateX(${-currentIndex * cardWidth + container.offsetWidth/2 - cardWidth/2 + diff}px)`;
// });

// container.addEventListener('touchend', e => {
//   isDragging = false;
//   const endX = e.changedTouches[0].clientX;
//   const diff = endX - startX;
//   if(diff < -50) moveNext();
//   else if(diff > 50) movePrev();
//   else moveToIndex(currentIndex);
//   startAutoSlide();
// });

// // INITIALIZE
// updateActive();
// startAutoSlide();

// const tutorialTrack = document.getElementById('tutorial-track');
// const tutorialContainer = document.getElementById('tutorial-container');
// const tutorialCards = Array.from(tutorialTrack.children);
// const tutorialPrev = document.querySelector('.tutorial-btn.prev');
// const tutorialNext = document.querySelector('.tutorial-btn.next');

// let tutorialIndex = 0;
// const tutorialCardWidth = tutorialCards[0].offsetWidth + 20; // width + margin
// let tutorialAutoSlide;

// // AUTO SLIDE
// function moveNextTutorial() {
//   tutorialIndex++;
//   if(tutorialIndex >= tutorialCards.length) tutorialIndex = 0;

//   tutorialTrack.style.transition = 'transform 0.5s ease';
//   tutorialTrack.style.transform = `translateX(${-tutorialIndex * tutorialCardWidth + tutorialContainer.offsetWidth/2 - tutorialCardWidth/2}px)`;
//   playSnippet(tutorialIndex);
// }

// // PLAY VIDEO SNIPPET
// function playSnippet(index) {
//   tutorialCards.forEach((card, i) => {
//     const video = card.querySelector('video');
//     video.pause();
//     video.currentTime = 0;
//   });
//   const activeVideo = tutorialCards[index].querySelector('video');
//   activeVideo.play();
//   setTimeout(() => {
//     activeVideo.pause();
//   }, 3000); // auto-play 3 seconds
// }

// // BUTTONS
// tutorialNext.addEventListener('click', moveNextTutorial);
// tutorialPrev.addEventListener('click', () => {
//   tutorialIndex--;
//   if(tutorialIndex < 0) tutorialIndex = tutorialCards.length - 1;
//   tutorialTrack.style.transition = 'transform 0.5s ease';
//   tutorialTrack.style.transform = `translateX(${-tutorialIndex * tutorialCardWidth + tutorialContainer.offsetWidth/2 - tutorialCardWidth/2}px)`;
//   playSnippet(tutorialIndex);
// });

// // AUTO SLIDE EVERY 5 SECONDS
// tutorialAutoSlide = setInterval(moveNextTutorial, 5000);

// // INITIAL VIDEO PLAY
// playSnippet(0);

// // PAUSE ON HOVER
// tutorialContainer.addEventListener('mouseenter', () => clearInterval(tutorialAutoSlide));
// tutorialContainer.addEventListener('mouseleave', () => tutorialAutoSlide = setInterval(moveNextTutorial, 5000));

class Carousel {
  constructor(options) {
    this.track = document.getElementById(options.trackId);
    this.container = document.getElementById(options.containerId);
    this.cards = Array.from(this.track.children);
    this.prevBtn = document.querySelector(options.prevBtn);
    this.nextBtn = document.querySelector(options.nextBtn);
    this.dots = options.dots ? Array.from(document.querySelectorAll(options.dots)) : null;
    this.autoSlideTime = options.autoSlideTime || 3000;
    this.isVideo = options.isVideo || false;

    this.cloneCount = options.cloneCount || 2;
    this.currentIndex = this.cloneCount;
    this.cardWidth = this.cards[0].offsetWidth + 20;

    this.autoSlide = null;
    this.startX = 0;
    this.isDragging = false;

    this.init();
  }

  init() {
    this.cloneCards();
    this.cards = Array.from(this.track.children);
    this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + this.container.offsetWidth/2 - this.cardWidth/2}px)`;

    this.updateActive();
    this.attachEvents();
    this.startAutoSlide();

    if (this.isVideo) this.playSnippet(this.currentIndex);
  }

  cloneCards() {
    for (let i = 0; i < this.cloneCount; i++) {
      const firstClone = this.cards[i].cloneNode(true);
      firstClone.classList.add('clone');
      this.track.appendChild(firstClone);

      const lastClone = this.cards[this.cards.length - 1 - i].cloneNode(true);
      lastClone.classList.add('clone');
      this.track.insertBefore(lastClone, this.track.firstChild);
    }
  }

  updateActive() {
    if (!this.dots) return;
    this.cards.forEach(c => c.classList.remove('active'));
    this.cards[this.currentIndex].classList.add('active');

    let activeOriginal = this.currentIndex - this.cloneCount;
    if (activeOriginal < 0) activeOriginal = this.cards.length - this.cloneCount*2 + activeOriginal;
    if (activeOriginal >= this.cards.length - this.cloneCount*2) activeOriginal -= this.cards.length - this.cloneCount*2;

    this.dots.forEach(d => d.classList.remove('active'));
    this.dots[activeOriginal].classList.add('active');
  }

  moveToIndex(index) {
    this.currentIndex = index;
    this.track.style.transition = 'transform 0.5s ease';
    this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + this.container.offsetWidth/2 - this.cardWidth/2}px)`;
    this.updateActive();
    if (this.isVideo) this.playSnippet(this.currentIndex);
  }

  moveNext() {
    this.currentIndex++;
    this.track.style.transition = 'transform 0.5s ease';
    this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + this.container.offsetWidth/2 - this.cardWidth/2}px)`;
    this.updateActive();
    this.track.addEventListener('transitionend', () => this.checkLoop());
    if (this.isVideo) this.playSnippet(this.currentIndex);
  }

  movePrev() {
    this.currentIndex--;
    this.track.style.transition = 'transform 0.5s ease';
    this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + this.container.offsetWidth/2 - this.cardWidth/2}px)`;
    this.updateActive();
    this.track.addEventListener('transitionend', () => this.checkLoop());
    if (this.isVideo) this.playSnippet(this.currentIndex);
  }

  checkLoop() {
    this.track.removeEventListener('transitionend', this.checkLoop);
    if (this.cards[this.currentIndex].classList.contains('clone')) {
      this.track.style.transition = 'none';
      if (this.currentIndex < this.cloneCount) {
        this.currentIndex = this.cards.length - this.cloneCount*2 + this.currentIndex;
      } else {
        this.currentIndex = this.currentIndex - (this.cards.length - this.cloneCount*2);
      }
      this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + this.container.offsetWidth/2 - this.cardWidth/2}px)`;
      this.updateActive();
    }
  }

  startAutoSlide() {
    this.autoSlide = setInterval(() => this.moveNext(), this.autoSlideTime);
  }

  stopAutoSlide() {
    clearInterval(this.autoSlide);
  }

  attachEvents() {
    // Buttons
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => { this.moveNext(); this.stopAutoSlide(); this.startAutoSlide(); });
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => { this.movePrev(); this.stopAutoSlide(); this.startAutoSlide(); });

    // Dots
    if (this.dots) {
      this.dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => this.moveToIndex(idx + this.cloneCount));
      });
    }

    // Hover pause
    this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
    this.container.addEventListener('mouseleave', () => this.startAutoSlide());

    // Swipe support
    this.container.addEventListener('touchstart', e => {
      this.startX = e.touches[0].clientX;
      this.isDragging = true;
      this.stopAutoSlide();
    });

    this.container.addEventListener('touchmove', e => {
      if(!this.isDragging) return;
      const x = e.touches[0].clientX;
      const diff = x - this.startX;
      this.track.style.transition = 'none';
      this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + this.container.offsetWidth/2 - this.cardWidth/2 + diff}px)`;
    });

    this.container.addEventListener('touchend', e => {
      this.isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - this.startX;
      if(diff < -50) this.moveNext();
      else if(diff > 50) this.movePrev();
      else this.moveToIndex(this.currentIndex);
      this.startAutoSlide();
    });

    // Resize handling
    window.addEventListener('resize', () => {
      this.cardWidth = this.cards[0].offsetWidth + 20;
      this.track.style.transition = 'none';
      this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + this.container.offsetWidth/2 - this.cardWidth/2}px)`;
    });
  }

  // Video snippet support
  playSnippet(index) {
    if (!this.isVideo) return;
    this.cards.forEach(card => {
      const video = card.querySelector('video');
      if(video) { video.pause(); video.currentTime = 0; }
    });
    const activeVideo = this.cards[index].querySelector('video');
    if(activeVideo){
      activeVideo.play();
      setTimeout(() => activeVideo.pause(), 3000);
    }
  }
}
// PRODUCT CAROUSEL
const productCarousel = new Carousel({
  trackId: 'carousel_track',
  containerId: 'carousel_container',
  prevBtn: '.prev',
  nextBtn: '.next',
  dots: '.carousel_dot',
  autoSlideTime: 3000
});

// TUTORIAL CAROUSEL
 const tutorialCarousel = new Carousel({
  trackId: 'tutorial-track',
   containerId: 'tutorial-container',
   prevBtn: '.tutorial-btn prev',
   nextBtn: '.tutorial-btn next',
   autoSlideTime: 2000,
   isVideo: true
 });
 const hero = document.querySelector('.hero');

  const heroImages = [
    'images/hero-1.jpg',
    'images/hero-2.jpg',
    'images/hero-3.jpg'
  ];

  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % heroImages.length;
    hero.style.backgroundImage = `url(${heroImages[currentIndex]})`;
  }, 1000); // changes every 5 seconds

  // HERO IMAGE CAROUSEL
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const heroImages = document.querySelectorAll('.hero-img');
    let currentIndex = 0;
    
    // Change image every 5 seconds
    function changeHeroImage() {
        // Remove active class from current image
        heroImages[currentIndex].classList.remove('active');
        
        // Move to next image
        currentIndex = (currentIndex + 1) % heroImages.length;
        
        // Add active class to new image
        heroImages[currentIndex].classList.add('active');
    }
    
    // Start carousel if there are multiple images
    if (heroImages.length > 1) {
        setInterval(changeHeroImage, 2000); // Change every 5 seconds
    }
});
const images = document.querySelectorAll(".hero-img");
const dots = document.querySelectorAll(".hero-dot");
let current = 0;
let interval;

function showSlide(index) {
  images.forEach((img, i) => {
    img.classList.remove("active");
    dots[i].classList.remove("active");
  });

  images[index].classList.add("active");
  dots[index].classList.add("active");
  current = index;
}

function nextSlide() {
  let next = (current + 1) % images.length;
  showSlide(next);
}

dots.forEach(dot => {
  dot.addEventListener("click", () => {
    let index = dot.getAttribute("data-index");
    showSlide(index);
  });
});

/* Auto play */
interval = setInterval(nextSlide,2000);

/* Start first slide */
showSlide(0);


