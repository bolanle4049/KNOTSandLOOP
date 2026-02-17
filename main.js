// ==========================================
// CAROUSEL CLASS
// ==========================================
class Carousel {
  constructor(options) {
    this.track = document.getElementById(options.trackId);
    this.container = document.getElementById(options.containerId);

    // Guard: if elements don't exist on this page, do nothing
    if (!this.track || !this.container) return;

    this.cards = Array.from(this.track.children);
    if (this.cards.length === 0) return;

    this.prevBtn = document.querySelector(options.prevBtn);
    this.nextBtn = document.querySelector(options.nextBtn);
    this.dots = options.dots ? Array.from(document.querySelectorAll(options.dots)) : null;
    this.autoSlideTime = options.autoSlideTime || 3000;
    this.isVideo = options.isVideo || false;
    this.cloneCount = options.cloneCount || 2;
    this.currentIndex = this.cloneCount;
    this.cardWidth = 0; // calculated after clones added
    this.autoSlide = null;
    this.startX = 0;
    this.isDragging = false;

    this.init();
  }

  // ✅ Get real card width from DOM after render
  getCardWidth() {
    const card = this.cards[this.currentIndex] || this.cards[0];
    if (!card) return 300;
    const style = window.getComputedStyle(card);
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;
    return card.offsetWidth + marginLeft + marginRight;
  }

  init() {
    this.cloneCards();
    this.cards = Array.from(this.track.children);

    // ✅ Calculate width AFTER clones are in the DOM
    this.cardWidth = this.getCardWidth();

    this.setPosition(false);
    this.updateActive();
    this.attachEvents();
    this.startAutoSlide();

    if (this.isVideo) this.playSnippet(this.currentIndex);
  }

  // ✅ Simple left-aligned positioning — no centering that breaks on mobile
  setPosition(animate) {
    this.track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth}px)`;
  }

  cloneCards() {
    // ✅ Save originals first to avoid cloning clones
    const originals = Array.from(this.track.children);
    for (let i = 0; i < this.cloneCount; i++) {
      const firstClone = originals[i].cloneNode(true);
      firstClone.classList.add('clone');
      this.track.appendChild(firstClone);

      const lastClone = originals[originals.length - 1 - i].cloneNode(true);
      lastClone.classList.add('clone');
      this.track.insertBefore(lastClone, this.track.firstChild);
    }
  }

  updateActive() {
    this.cards.forEach(c => c.classList.remove('active'));
    if (this.cards[this.currentIndex]) {
      this.cards[this.currentIndex].classList.add('active');
    }

    if (!this.dots) return;

    let activeOriginal = this.currentIndex - this.cloneCount;
    const totalOriginal = this.cards.length - this.cloneCount * 2;
    if (activeOriginal < 0) activeOriginal = totalOriginal + activeOriginal;
    if (activeOriginal >= totalOriginal) activeOriginal -= totalOriginal;

    this.dots.forEach(d => d.classList.remove('active'));
    if (this.dots[activeOriginal]) {
      this.dots[activeOriginal].classList.add('active');
    }
  }

  moveNext() {
    this.currentIndex++;
    this.setPosition(true);
    this.updateActive();
    this.track.addEventListener('transitionend', () => this.checkLoop(), { once: true });
    if (this.isVideo) this.playSnippet(this.currentIndex);
  }

  movePrev() {
    this.currentIndex--;
    this.setPosition(true);
    this.updateActive();
    this.track.addEventListener('transitionend', () => this.checkLoop(), { once: true });
    if (this.isVideo) this.playSnippet(this.currentIndex);
  }

  moveToIndex(index) {
    this.currentIndex = index;
    this.setPosition(true);
    this.updateActive();
    if (this.isVideo) this.playSnippet(this.currentIndex);
  }

  checkLoop() {
    if (!this.cards[this.currentIndex]) return;
    if (this.cards[this.currentIndex].classList.contains('clone')) {
      const totalOriginal = this.cards.length - this.cloneCount * 2;
      this.track.style.transition = 'none';
      if (this.currentIndex < this.cloneCount) {
        this.currentIndex = this.currentIndex + totalOriginal;
      } else {
        this.currentIndex = this.currentIndex - totalOriginal;
      }
      this.setPosition(false);
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
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => { this.moveNext(); this.stopAutoSlide(); this.startAutoSlide(); });
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => { this.movePrev(); this.stopAutoSlide(); this.startAutoSlide(); });

    if (this.dots) {
      this.dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          this.moveToIndex(idx + this.cloneCount);
          this.stopAutoSlide();
          this.startAutoSlide();
        });
      });
    }

    // Hover pause
    this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
    this.container.addEventListener('mouseleave', () => this.startAutoSlide());

    // Touch/swipe support
    this.container.addEventListener('touchstart', e => {
      this.startX = e.touches[0].clientX;
      this.isDragging = true;
      this.stopAutoSlide();
    }, { passive: true });

    this.container.addEventListener('touchmove', e => {
      if (!this.isDragging) return;
      const diff = e.touches[0].clientX - this.startX;
      this.track.style.transition = 'none';
      this.track.style.transform = `translateX(${-this.currentIndex * this.cardWidth + diff}px)`;
    }, { passive: true });

    this.container.addEventListener('touchend', e => {
      this.isDragging = false;
      const diff = e.changedTouches[0].clientX - this.startX;
      if (diff < -50) this.moveNext();
      else if (diff > 50) this.movePrev();
      else this.setPosition(true);
      this.startAutoSlide();
    });

    // ✅ Recalculate on resize so cards never disappear
    window.addEventListener('resize', () => {
      this.cardWidth = this.getCardWidth();
      this.setPosition(false);
    });
  }

  // Video snippet support
  playSnippet(index) {
    if (!this.isVideo) return;
    this.cards.forEach(card => {
      const video = card.querySelector('video');
      if (video) { video.pause(); video.currentTime = 0; }
    });
    const activeCard = this.cards[index];
    const activeVideo = activeCard && activeCard.querySelector('video');
    if (activeVideo) {
      activeVideo.play().catch(() => {});
      setTimeout(() => activeVideo.pause(), 3000);
    }
  }
}

// ==========================================
// INITIALISE ON DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', function () {

  // PRODUCT CAROUSEL (home page)
  if (document.getElementById('carousel_track')) {
    new Carousel({
      trackId: 'carousel_track',
      containerId: 'carousel_container',
      prevBtn: '.carousel_btn.prev',  // ✅ fixed selector
      nextBtn: '.carousel_btn.next',  // ✅ fixed selector
      dots: '.carousel_dot',
      autoSlideTime: 3000
    });
  }

  // TUTORIAL CAROUSEL (home page)
  if (document.getElementById('tutorial-track')) {
    new Carousel({
      trackId: 'tutorial-track',
      containerId: 'tutorial-container',
      prevBtn: '.tutorial-btn.prev',  // ✅ fixed selector (was '.tutorial-btn prev')
      nextBtn: '.tutorial-btn.next',  // ✅ fixed selector (was '.tutorial-btn next')
      autoSlideTime: 5000,
      isVideo: true
    });
  }

  // ==========================================
  // HERO IMAGE CAROUSEL
  // ==========================================
  const heroImages = document.querySelectorAll('.hero-img');
  const heroDots = document.querySelectorAll('.hero-dot');
  let heroCurrent = 0;
  let heroInterval;

  function showSlide(index) {
    heroImages.forEach((img, i) => {
      img.classList.remove('active');
      if (heroDots[i]) heroDots[i].classList.remove('active');
    });
    heroImages[index].classList.add('active');
    if (heroDots[index]) heroDots[index].classList.add('active');
    heroCurrent = index;
  }

  function nextHeroSlide() {
    showSlide((heroCurrent + 1) % heroImages.length);
  }

  if (heroImages.length > 1) {
    heroDots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(heroInterval);
        showSlide(parseInt(dot.getAttribute('data-index')));
        heroInterval = setInterval(nextHeroSlide, 4000);
      });
    });

    heroInterval = setInterval(nextHeroSlide, 4000);
    showSlide(0); // ✅ start on first slide
  }

  // ==========================================
  // HAMBURGER MENU
  // ==========================================
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
        
//         navMenu.classList.remove('active');
//         overlay.classList.remove('active');
//         document.body.style.overflow = '';
//       }
//     });
//   }

// });