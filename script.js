// ===== Header Scroll Effect =====
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// ===== Mobile Menu =====
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
const mobileLinks = mobileNav.querySelectorAll('a');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  mobileNav.classList.toggle('active');
  document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ===== Slider =====
const sliderTrack = document.getElementById('sliderTrack');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const sliderDots = document.getElementById('sliderDots');
const slides = document.querySelectorAll('.slider__slide');
const totalSlides = slides.length;
let currentSlide = 0;
let autoSlideInterval;

function getSlidesPerView() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

function updateSlider() {
  const slidesPerView = getSlidesPerView();
  const maxSlide = Math.max(0, totalSlides - slidesPerView);
  currentSlide = Math.min(currentSlide, maxSlide);
  
  const gap = 24;
  const slideWidth = slides[0] ? slides[0].getBoundingClientRect().width : 300;
  const offset = currentSlide * (slideWidth + gap);
  if (sliderTrack) {
    sliderTrack.style.transform = `translateX(-${offset}px)`;
  }
  
  // Update dots
  document.querySelectorAll('.slider__dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function createDots() {
  sliderDots.innerHTML = '';
  const slidesPerView = getSlidesPerView();
  const dotCount = Math.max(1, totalSlides - slidesPerView + 1);
  
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('button');
    dot.className = 'slider__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Слайд ${i + 1}`);
    dot.addEventListener('click', () => {
      currentSlide = i;
      updateSlider();
      resetAutoSlide();
    });
    sliderDots.appendChild(dot);
  }
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => {
    const slidesPerView = getSlidesPerView();
    const maxSlide = Math.max(0, totalSlides - slidesPerView);
    currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
    updateSlider();
  }, 4000);
}

sliderPrev?.addEventListener('click', () => {
  currentSlide = Math.max(0, currentSlide - 1);
  updateSlider();
  resetAutoSlide();
});

sliderNext?.addEventListener('click', () => {
  const slidesPerView = getSlidesPerView();
  const maxSlide = Math.max(0, totalSlides - slidesPerView);
  currentSlide = Math.min(maxSlide, currentSlide + 1);
  updateSlider();
  resetAutoSlide();
});

createDots();
updateSlider();
resetAutoSlide();

window.addEventListener('resize', () => {
  createDots();
  updateSlider();
});

// ===== Scroll Animations =====
const animatedElements = document.querySelectorAll('[data-animate]');

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

animatedElements.forEach(el => observer.observe(el));

// ===== Parallax =====
const parallaxLayers = document.querySelectorAll('[data-parallax]');

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  
  parallaxLayers.forEach(layer => {
    const speed = parseFloat(layer.dataset.parallax) || 0.5;
    const rect = layer.closest('.parallax-section').getBoundingClientRect();
    const sectionTop = rect.top + scrollY;
    const yPos = (scrollY - sectionTop + window.innerHeight) * speed * 0.1;
    layer.style.transform = `translateY(${yPos}px)`;
  });
});

// ===== Particle Effect =====
const particlesContainer = document.getElementById('particles');

function createParticle() {
  if (!particlesContainer) return;
  const particle = document.createElement('div');
  particle.className = 'particle';
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const dx = (Math.random() - 0.5) * 100;
  const duration = 5 + Math.random() * 8;
  particle.style.cssText = `
    left: ${x}%;
    top: ${y}%;
    --dx: ${dx}px;
    animation-duration: ${duration}s;
    animation-delay: ${Math.random() * 2}s;
  `;
  particlesContainer.appendChild(particle);
  setTimeout(() => particle.remove(), duration * 1000);
}

for (let i = 0; i < 25; i++) {
  setTimeout(createParticle, i * 400);
}
setInterval(createParticle, 600);

// ===== Stats Counter =====
const statCards = document.querySelectorAll('.stat-card[data-animate]');

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const valueEl = entry.target.querySelector('.stat-card__value');
      const target = parseInt(valueEl.dataset.count) || 0;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const updateCounter = () => {
        current += step;
        if (current < target) {
          valueEl.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          valueEl.textContent = target;
        }
      };
      
      updateCounter();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statCards.forEach(card => statsObserver.observe(card));

// ===== Button Ripple Effect =====
document.querySelectorAll('.cta-button').forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: ripple 0.6s ease-out;
    `;
    
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
      @keyframes ripple {
        to {
          width: 300px;
          height: 300px;
          opacity: 0;
        }
      }
    `;
    if (!document.getElementById('ripple-style')) {
      rippleStyle.id = 'ripple-style';
      document.head.appendChild(rippleStyle);
    }
    
    setTimeout(() => ripple.remove(), 600);
  });
});
