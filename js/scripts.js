;document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize Locomotive Scroll
  const scroll = new LocomotiveScroll({
    el: document.querySelector('body'),
    smooth: true,
    multiplier: 1.2,
    class: 'is-reveal',
    scrollbarContainer: false,
    smartphone: {
      smooth: true
    },
    tablet: {
      smooth: true
    }
  });

  // Custom Minimalist Circle Cursor
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  // Update mouse position
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor animation with faster speed
  function animateCursor() {
    const speed = 0.25; // Increased from 0.15 to 0.25 for faster response
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover effects
  const hoverElements = document.querySelectorAll('a, button, .btn, .faq-question, .course-card, .testimonial-card, .pricing-card');
  
  hoverElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      cursor.classList.add('hover');
    });
    
    element.addEventListener('mouseleave', function() {
      cursor.classList.remove('hover');
    });
    
    element.addEventListener('mousedown', function() {
      cursor.classList.add('click');
    });
    
    element.addEventListener('mouseup', function() {
      cursor.classList.remove('click');
    });
  });

  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', function() {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', function() {
    cursor.style.opacity = '1';
  });

  // Scroll animations for elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Add scroll animation class to elements
  const animateElements = document.querySelectorAll('.course-card, .testimonial-card, .pricing-card, .faq-item, .teacher-profile h2, .teacher-profile p');
  animateElements.forEach(element => {
    element.classList.add('scroll-animate');
    scrollObserver.observe(element);
  });

  // Enhanced smooth scrolling with easing
  function smoothScrollTo(target, duration = 1000) {
    const targetPosition = target.offsetTop - 80; // Account for fixed header
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutCubic(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animation);
  }

  // Mobile Navigation Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navList = document.querySelector('nav ul');

  if (menuToggle && navList) {
    try {
      menuToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
        
        // Update ARIA attribute for accessibility
        const isExpanded = navList.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
      });
    } catch (error) {
      console.error('Error setting up the mobile nav toggle:', error);
    }
  }

  // Enhanced Smooth Scrolling for In-Page Links with Locomotive Scroll
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        if (navList && navList.classList.contains('active')) {
          navList.classList.remove('active');
          if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
          }
        }
        
        // Use Locomotive Scroll for smooth scrolling
        scroll.scrollTo(targetElement, {
          offset: -80,
          duration: 1200,
          easing: [0.25, 0.0, 0.35, 1.0]
        });
      }
    });
  });

  // FAQ Accordion Functionality
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      
      if (answer) {
        // Close all other FAQ items
        faqQuestions.forEach(otherQuestion => {
          if (otherQuestion !== this) {
            const otherAnswer = otherQuestion.nextElementSibling;
            if (otherAnswer) {
              otherAnswer.classList.remove('open');
              otherAnswer.setAttribute('hidden', '');
              otherQuestion.setAttribute('aria-expanded', 'false');
            }
          }
        });
        
        // Toggle current FAQ item
        const isOpen = answer.classList.contains('open');
        
        if (isOpen) {
          answer.classList.remove('open');
          answer.setAttribute('hidden', '');
          this.setAttribute('aria-expanded', 'false');
        } else {
          answer.classList.add('open');
          answer.removeAttribute('hidden');
          this.setAttribute('aria-expanded', 'true');
        }
      }
    });

    // Add keyboard support for FAQ
    question.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Image Error Handling
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function() {
      // Create a fallback div if image fails to load
      const fallback = document.createElement('div');
      fallback.className = 'img-fallback';
      fallback.textContent = 'Image not available';
      fallback.style.width = this.style.width || '100%';
      fallback.style.height = this.style.height || '200px';
      
      // Replace the broken image with fallback
      if (this.parentNode) {
        this.parentNode.replaceChild(fallback, this);
      }
    });
  });

  // Scroll to top functionality with custom cursor
  let scrollToTopBtn = null;
  
  function createScrollToTopButton() {
    scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff6b6b, #ffa500);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 20px;
      cursor: none;
      display: none;
      z-index: 1000;
      transition: all 0.3s;
    `;
    
    scrollToTopBtn.addEventListener('click', function() {
      scroll.scrollTo('top', {
        duration: 1000,
        easing: [0.25, 0.0, 0.35, 1.0]
      });
    });
    
    // Add cursor hover effect
    scrollToTopBtn.addEventListener('mouseenter', function() {
      cursor.classList.add('hover');
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
      cursor.classList.remove('hover');
    });
    
    document.body.appendChild(scrollToTopBtn);
  }

  // Show/hide scroll to top button based on scroll position
  function handleScroll() {
    if (!scrollToTopBtn) {
      createScrollToTopButton();
    }
    
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.display = 'block';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  }

  window.addEventListener('scroll', handleScroll);

  // Performance optimization: Lazy loading for images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // Observe images with data-src attribute for lazy loading
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Add loading states for buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Add loading state for external links
      if (this.href && !this.href.startsWith('#')) {
        this.style.opacity = '0.7';
        this.style.pointerEvents = 'none';
        
        // Reset after 2 seconds (in case navigation doesn't happen)
        setTimeout(() => {
          this.style.opacity = '1';
          this.style.pointerEvents = 'auto';
        }, 2000);
      }
    });
  });

  // Add cursor effect to login button
  const loginBtn = document.querySelector('.login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('mouseenter', function() {
      cursor.classList.add('hover');
    });
    
    loginBtn.addEventListener('mouseleave', function() {
      cursor.classList.remove('hover');
    });
    
    loginBtn.addEventListener('mousedown', function() {
      cursor.classList.add('click');
    });
    
    loginBtn.addEventListener('mouseup', function() {
      cursor.classList.remove('click');
    });
  }

  // Parallax effect for hero section
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
      const rate = scrolled * -0.5;
      hero.style.transform = `translateY(${rate}px)`;
    }
  });

  // Console log for debugging
  console.log('Kolder Creative Clone - Enhanced JavaScript loaded successfully');
  console.log('Features initialized: Custom cursor, enhanced smooth scrolling, scroll animations, mobile nav, FAQ accordion, image error handling');
});

// Global error handler
window.addEventListener('error', function(e) {
  console.error('Global error caught:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
});
