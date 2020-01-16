'use strict';

(function () {
  var containers = document.querySelectorAll('.bg-parallax');
  if (containers !== null) {
    Array.prototype.slice.call(containers).forEach(function (item) {
      var element = item.querySelector('.bg-parallax__element');
      item.addEventListener('mousemove', function (evt) {
        var w = window.innerWidth / 2;
        var h = window.innerHeight / 2;
        var mouseX = evt.clientX;
        var mouseY = evt.clientY;
        element.style.backgroundPositionX = 'calc(-3.5vw + ' + ((mouseX - w) * 0.05) + 'px)';
        element.style.backgroundPositionY = 'calc(-3.5vh + ' + ((mouseY - h) * 0.05) + 'px)';
      });
    });
  }
})();
