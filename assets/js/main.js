---
 # Only the main Javascript file needs front matter(the dashes are enough)
---

(function() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('#' + burger.dataset.target);
  burger.addEventListener('click', function() {
    burger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
  });
})();