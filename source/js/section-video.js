'use strict';

(function () {
  var container = document.querySelector('.video__content-wrapper');

  if(!container) return;

  var button = container.querySelector('.video__button');
  var video = container.querySelector('.video__video');

  container.classList.add('video__content-wrapper--js');
  video.controls = false;

  function controlClickHandler() {
    video.style.background = "none";
    video.style.backgroundColor = "black";
    video.controls = true;
    video.play();
    button.classList.add('video__button--animation');

    setTimeout(removeButton, 1500);
  };

  function removeButton() {
    button.style.display = 'none';
  }

  button.addEventListener('click', controlClickHandler);
})();