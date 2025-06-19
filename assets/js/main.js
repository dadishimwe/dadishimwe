/**
 * Enhanced Main JavaScript File
 * Includes theme switching, smooth scrolling, form validation, and modern interactions
 */

(function() {
  "use strict";

  /**
   * Theme Toggle Functionality
   */
  function initThemeToggle() {
    const themeToggle = document.querySelector('#theme-toggle');
    const root = document.documentElement;
    
    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', currentTheme);
    
    // Update toggle icon based on current theme
    updateThemeIcon(currentTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
          document.body.style.transition = '';
        }, 300);
      });
    }
  }
  
  function updateThemeIcon(theme) {
    const themeToggle = document.querySelector('#theme-toggle i');
    if (themeToggle) {
      themeToggle.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }
  }

  /**
   * Smooth Scrolling Navigation
   */
  function initSmoothScrolling() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.offsetTop;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Update active navigation
          updateActiveNavigation(this.getAttribute('href'));
        }
      });
    });
  }

  /**
   * Update Active Navigation on Scroll
   */
  function updateActiveNavigation(targetId = null) {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navmenu a[href^="#"]');
    
    if (targetId) {
      // Manual navigation click
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
          link.classList.add('active');
        }
      });
    } else {
      // Scroll-based navigation update
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }
  }

  /**
   * Enhanced Form Validation
   */
  function initFormValidation() {
    const form = document.querySelector('.php-email-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Real-time validation
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearFieldError(input));
    });

    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        submitForm(form);
      }
    });
  }

  function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');
    
    // Remove existing error styling
    clearFieldError(field);
    
    if (isRequired && !value) {
      showFieldError(field, 'This field is required');
      return false;
    }
    
    if (fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
      }
    }
    
    if (field.name === 'name' && value && value.length < 2) {
      showFieldError(field, 'Name must be at least 2 characters long');
      return false;
    }
    
    if (field.name === 'message' && value && value.length < 10) {
      showFieldError(field, 'Message must be at least 10 characters long');
      return false;
    }
    
    return true;
  }

  function showFieldError(field, message) {
    field.style.borderColor = '#df1529';
    field.style.boxShadow = '0 0 0 0.2rem rgba(223, 21, 41, 0.25)';
    
    // Create or update error message
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.style.color = '#df1529';
      errorElement.style.fontSize = '12px';
      errorElement.style.marginTop = '5px';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  function submitForm(form) {
    const loadingElement = form.querySelector('.loading');
    const errorElement = form.querySelector('.error-message');
    const successElement = form.querySelector('.sent-message');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    loadingElement.style.display = 'block';
    errorElement.style.display = 'none';
    successElement.style.display = 'none';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
      loadingElement.style.display = 'none';
      successElement.style.display = 'block';
      submitBtn.disabled = false;
      form.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        successElement.style.display = 'none';
      }, 5000);
    }, 2000);
  }

  /**
   * Lazy Loading for Images
   */
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * Enhanced Scroll Animations
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-on-scroll');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  /**
   * Enhanced Typing Animation
   */
  function initEnhancedTyping() {
    const selectTyped = document.querySelector('.typed');
    if (selectTyped) {
      let typed_strings = selectTyped.getAttribute('data-typed-items');
      typed_strings = typed_strings.split(',');
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 1500,
        startDelay: 500,
        showCursor: true,
        cursorChar: '|',
        autoInsertCss: true
      });
    }
  }

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  function initMobileNavigation() {
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
    }

    document.querySelectorAll('#navmenu a').forEach(navmenu => {
      navmenu.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) {
          mobileNavToogle();
        }
      });
    });

    // Toggle mobile nav dropdowns
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
      navmenu.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });
  }

  /**
   * Preloader
   */
  function initPreloader() {
    const preloader = document.querySelector('#preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.remove();
        }, 300);
      });
    }
  }

  /**
   * Scroll top button
   */
  function initScrollTop() {
    let scrollTop = document.querySelector('.scroll-top');

    function toggleScrollTop() {
      if (scrollTop) {
        window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
      }
    }

    if (scrollTop) {
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);
  }

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 100
    });
  }

  /**
   * Initiate Pure Counter
   */
  function initPureCounter() {
    new PureCounter({
      duration: 2,
      delay: 10
    });
  }

  /**
   * Animate the skills items on reveal
   */
  function initSkillsAnimation() {
    let skillsAnimation = document.querySelectorAll('.skills-animation');
    skillsAnimation.forEach((item) => {
      new Waypoint({
        element: item,
        offset: '80%',
        handler: function(direction) {
          let progress = item.querySelectorAll('.progress .progress-bar');
          progress.forEach(el => {
            el.style.width = el.getAttribute('aria-valuenow') + '%';
          });
        }
      });
    });
  }

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  /**
   * Initiate glightbox
   */
  function initGLightbox() {
    const glightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      autoplayVideos: true
    });
  }

  /**
   * Init isotope layout and filters
   */
  function initIsotope() {
    document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

      let initIsotope;
      imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
        initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
          transitionDuration: '0.5s'
        });
      });

      isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
        filters.addEventListener('click', function() {
          isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
          this.classList.add('filter-active');
          initIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          if (typeof aosInit === 'function') {
            aosInit();
          }
        }, false);
      });
    });
  }

  /**
   * Parallax Effect for Hero Section
   */
  function initParallax() {
    const heroImage = document.querySelector('.hero img');
    if (heroImage) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
      });
    }
  }

  /**
   * Initialize all functions when DOM is loaded
   */
  document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initSmoothScrolling();
    initFormValidation();
    initMobileNavigation();
    initPreloader();
    initScrollTop();
    initEnhancedTyping();
    initPureCounter();
    initSkillsAnimation();
    initGLightbox();
    initIsotope();
    initParallax();
    
    // Initialize AOS after a short delay
    setTimeout(aosInit, 100);
  });

  // Event listeners for scroll-based functions
  document.addEventListener('scroll', function() {
    toggleScrolled();
    updateActiveNavigation();
  });

  window.addEventListener('load', function() {
    toggleScrolled();
    initSwiper();
    initLazyLoading();
    initScrollAnimations();
  });

})();

