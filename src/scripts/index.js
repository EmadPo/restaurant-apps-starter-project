import 'regenerator-runtime';

// css
import '../styles/main.css';
import '../styles/favorit.css';
import '../styles/detail.css';
import '../styles/favorit.css';
import '../styles/loading.css';

// js
import './api.js';
import './favorit.js';
import './notification.js';
import './detail.js';

document.addEventListener('DOMContentLoaded', function () {
  // // sw
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            'Service Worker registered with scope:',
            registration.scope
          );
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  } else {
    console.log('Service workers are not supported in this browser.');
  }

  // loading
  const loadingElement = document.querySelector('.loading');
  if (loadingElement) {
    window.addEventListener('load', function () {
      loadingElement.style.display = 'none';
      const loadDataElement = document.getElementById('load-data');
      if (loadDataElement) {
        loadDataElement.style.display = 'block';
      }
    });
  } else {
    console.error('.loading element not found');
  }

  // Navbar logo scroll
  const navbarLogo = document.querySelector('.navbar-logo');
  navbarLogo.addEventListener('click', function (event) {
    event.preventDefault();
    scrollToSection('Home');
  });

  // skip to konten
  const skipToContentLink = document.querySelector('.skip-to-content');
  if (skipToContentLink) {
    skipToContentLink.addEventListener('click', function (event) {
      event.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
      }
    });

    skipToContentLink.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  const hamburgericon = document.querySelector('.hamburger-icon');
  const navbarRightprop = document.querySelector('.navbar-right-prop');

  hamburgericon.addEventListener('click', function () {
    navbarRightprop.classList.toggle('open');
  });

  // direct scroll
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        behavior: 'smooth',
        inline: 'nearest',
        top: section.offsetTop - 50,
      });
    }
  }
  const exploreButton = document.querySelector('.btn-explore');
  if (exploreButton) {
    exploreButton.addEventListener('click', function (event) {
      event.preventDefault();
      scrollToSection('About');
    });
  }
  const navbarLinks = document.querySelectorAll('.nav-line');
  navbarLinks.forEach((link) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });

  // scroll navbar
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    var navbar = document.getElementById('navbar');
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});
