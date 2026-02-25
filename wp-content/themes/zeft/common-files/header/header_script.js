/**
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const menu = document.querySelector('.fita-mega-menu');
  const toggle = document.querySelector('.fita-menu-toggle');
  const overlay = document.querySelector('.fita-mobile-overlay');
  const mobileCloseButton = document.querySelector('.fita-mobile-close');
  const searchInputs = document.querySelectorAll('.fita-search-input');
  const categoriesList = document.getElementById('categoriesList');
  const coursesCol = document.getElementById('coursesCol');
  const mobileAccordion = document.getElementById('mobileAccordion');
  
  // Variables for hover timing
  let hoverTimer;
  const hoverDelay = 200; // milliseconds delay before showing/hiding
  let isMobile = window.innerWidth <= 768;

  // Generate the menu from JSON data
  function generateMenu() {
    // Generate desktop categories list
    menuData.categories.forEach((category, index) => {
      const categoryItem = document.createElement('li');
      categoryItem.className = `fita-category-item ${index === 0 ? 'fita-active-category' : ''}`;
      categoryItem.dataset.category = category.id;
      
      categoryItem.innerHTML = `
        <img class="fita-category-icon" src="${category.icon}" alt="${category.name}">
        <span class="fita-category-name">${category.name}</span>
      `;
      
      categoriesList.appendChild(categoryItem);
    });

    // Generate desktop courses columns
    menuData.categories.forEach((category, index) => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = `fita-courses-category ${index === 0 ? 'fita-active-courses' : ''}`;
      categoryDiv.id = category.id;
      
      const title = document.createElement('div');
      title.className = 'fita-courses-title';
      title.textContent = category.name;
      
      const grid = document.createElement('div');
      grid.className = 'fita-courses-grid';
      
      category.courses.forEach(course => {
        const courseCard = document.createElement('a');
        courseCard.className = 'fita-course-card';
        courseCard.href = course.url;
        
        courseCard.innerHTML = `
          <div class="fita-course-icon">
            <img src="${course.icon}" alt="${course.name}">
          </div>
          <div class="fita-course-info">
            <h5 class="fita-course-name">${course.name}</h5>
          </div>
        `;
        
        grid.appendChild(courseCard);
      });
      
      categoryDiv.appendChild(title);
      categoryDiv.appendChild(grid);
      coursesCol.appendChild(categoryDiv);
    });

    // Generate mobile accordion
    menuData.categories.forEach((category, index) => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = `fita-accordion-category ${index === 0 ? 'fita-active-category' : ''}`;
      categoryDiv.dataset.category = category.id;
      
      const header = document.createElement('div');
      header.className = 'fita-accordion-header';
      
      header.innerHTML = `
        <img class="fita-category-icon" src="${category.icon}" alt="${category.name}">
        <span class="fita-category-name">${category.name}</span>
        <i class="fita-accordion-arrow fa fa-chevron-down"></i>
      `;
      
      const content = document.createElement('div');
      content.className = 'fita-accordion-content';
      
      const grid = document.createElement('div');
      grid.className = 'fita-courses-grid';
      
      category.courses.forEach(course => {
        const courseCard = document.createElement('a');
        courseCard.className = 'fita-course-card';
        courseCard.href = course.url;
        
        courseCard.innerHTML = `
          <div class="fita-course-icon">
            <img src="${course.icon}" alt="${course.name}">
          </div>
          <div class="fita-course-info">
            <h5 class="fita-course-name">${course.name}</h5>
          </div>
        `;
        
        grid.appendChild(courseCard);
      });
      
      content.appendChild(grid);
      categoryDiv.appendChild(header);
      categoryDiv.appendChild(content);
      mobileAccordion.appendChild(categoryDiv);
    });
  }

 // Initialize the menu
  generateMenu();

  // Flattened course list for search
  const allCourses = menuData.categories.flatMap(category => 
    category.courses.map(course => ({
      ...course,
      categoryId: category.id,
      categoryName: category.name
    }))
  );

  // Show menu function
  function showMenu() {
    clearTimeout(hoverTimer);
    menu.classList.add('fita-menu-open');
  }

  // Hide menu function
  function hideMenu() {
    clearTimeout(hoverTimer);
    menu.classList.remove('fita-menu-open');
  }

  // Desktop hover behavior
  function setupDesktopHover() {
    // Remove mobile event listeners first
    toggle.removeEventListener('click', mobileToggleHandler);
    overlay.removeEventListener('click', hideMenu);
    mobileCloseButton.removeEventListener('click', hideMenu);
    
    // Add hover events
    toggle.addEventListener('mouseenter', showMenu);
    toggle.addEventListener('mouseleave', hideMenu);
    menu.addEventListener('mouseenter', showMenu);
    menu.addEventListener('mouseleave', hideMenu);
  }

  // Mobile click handler
  function mobileToggleHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    menu.classList.toggle('fita-menu-open');
  }

  // Mobile touch behavior
  function setupMobileTouch() {
    // Remove hover events first
    toggle.removeEventListener('mouseenter', showMenu);
    toggle.removeEventListener('mouseleave', hideMenu);
    menu.removeEventListener('mouseenter', showMenu);
    menu.removeEventListener('mouseleave', hideMenu);
    
    // Add click events
    toggle.addEventListener('click', mobileToggleHandler);
    overlay.addEventListener('click', hideMenu);
    mobileCloseButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      hideMenu();
    });
  }

  // Check screen size and set appropriate behavior
  function checkScreenSize() {
    isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      setupDesktopHover();
    } else {
      setupMobileTouch();
    }
  }

  // Initial setup
  checkScreenSize();
  
  // Re-check on resize
  window.addEventListener('resize', checkScreenSize);

  // Category navigation (desktop)
  document.querySelectorAll('.fita-category-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      if (isMobile) return;
      
      const category = this.getAttribute('data-category');
      
      // Update active category
      document.querySelectorAll('.fita-category-item').forEach(i => {
        i.classList.remove('fita-active-category');
      });
      this.classList.add('fita-active-category');
      
      // Show corresponding courses
      document.querySelectorAll('.fita-courses-category').forEach(cat => {
        cat.classList.remove('fita-active-courses');
      });
      document.getElementById(category).classList.add('fita-active-courses');
    });
  });
  
  // Accordion functionality (mobile)
  document.querySelectorAll('.fita-accordion-header').forEach(header => {
    header.addEventListener('click', function() {
      if (!isMobile) return;
      
      const category = this.parentElement;
      
      // Toggle active class
      if (category.classList.contains('fita-active-category')) {
        category.classList.remove('fita-active-category');
      } else {
        // Close all other categories
        document.querySelectorAll('.fita-accordion-category').forEach(cat => {
          cat.classList.remove('fita-active-category');
        });
        // Open this one
        category.classList.add('fita-active-category');
      }
    });
  });
  
  // Search functionality for all search inputs
  searchInputs.forEach(input => {
    const searchResults = input.nextElementSibling;
    
    input.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      searchResults.innerHTML = '';
      
      if (query.length < 2) {
        searchResults.style.display = 'none';
        return;
      }
      
      const matches = allCourses.filter(course => 
        course.name.toLowerCase().includes(query)
      );
      
      if (matches.length > 0) {
        matches.forEach(course => {
          const link = document.createElement('a');
          link.href = course.url;
          link.innerHTML = `
            <img src="${course.icon}" alt="${course.name}" class="search-result-icon">
            <span>${course.name}</span>
            <small>${course.categoryName}</small>
          `;
          link.addEventListener('click', function() {
            if (isMobile) {
              hideMenu();
            }
          });
          searchResults.appendChild(link);
        });
        searchResults.style.display = 'block';
      } else {
        searchResults.style.display = 'none';
      }
    });
  });
  
  // Close search results when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.fita-search-box')) {
      document.querySelectorAll('.fita-search-results').forEach(results => {
        results.style.display = 'none';
      });
    }
  });
});

**/


jQuery(document).ready(function($) {
    // Mobile accordion functionality
    $('.cm-mobile-city-toggle').click(function(e) {
        e.preventDefault();
        $(this).closest('.cm-mobile-city').toggleClass('active');
        $(this).next('.cm-mobile-branches').slideToggle();
    });

    // Switch between desktop and mobile menus
    function checkMenuVisibility() {
        if ($(window).width() < 992) {
            $('.contact-mega-fresh').hide();
            $('.contact-mobile-fresh').show();
        } else {
            $('.contact-mega-fresh').show();
            $('.contact-mobile-fresh').hide();
        }
    }

    // Initialize
    checkMenuVisibility();
    
    // Update on resize
    $(window).resize(function() {
        checkMenuVisibility();
    });
});