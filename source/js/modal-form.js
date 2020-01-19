'use strict';

(function () {
  var page = document.querySelector('body');
  var orderButtons = page.querySelectorAll('.order-button-js');
  var modalForm = page.querySelector('.modal-form-js');
  var ESC_CODE = 27;

  if (!orderButtons && !orderButtons && !modalForm) {
    return;
  }

  var buttonClose = modalForm.querySelector('.modal-button-js');

  orderButtons.forEach(function(button) {
    button.addEventListener('click', function(evt) {
      evt.preventDefault();

      showOverlay();
      showModalForm();
    });
  });


  function showModalForm() {
    modalForm.classList.remove('modal-form--hide');

    if (!modalForm.classList.contains('modal-form--show')) {
      modalForm.classList.add('modal-form--show');
    }

    // Обработчик закрывает сообщение об отправке данных при клике по кнопке.
    buttonClose.addEventListener('click', onButtonCloseClick);

    // Обработчик закрывает сообщение об отправке данных по ESC.
    document.addEventListener('keydown', onEscKeydown);
    
    // Обработчик закрывает сообщение об отправке данных при клике по произвольной области.
    document.addEventListener('click', onWindowClick);
  }
  
  
  function hideModalForm() {
    modalForm.classList.remove('modal-form--show');

    if (!modalForm.classList.contains('modal-form--hide')) {
      modalForm.classList.add('modal-form--hide');
    }
  }

  // Показывает оверлей, убирает скролл на странице.
  function showOverlay() {
    window.overlay.showOverlay();
    scrollLock.disablePageScroll(page);
  }

  // Скрывает оверлей, добавляет скролл на страницу.
  function removeOverlay() {
    window.overlay.hideOverlay();
    scrollLock.enablePageScroll(page);
  }

  // Закрывает сообщение об отправке данных по ESC.
  function onEscKeydown(evt) {
    if (evt.keyCode === ESC_CODE) {
      onButtonCloseClick();
    }
  }

  // Закрывает сообщение об отправке данных при клике по произвольной области.
  function onWindowClick(evt) {
    var target = evt.target;

    if (target.classList.contains('overlay')) {
      onButtonCloseClick();
    }
  }

  // Закрывает сообщение об отправке данных по клику на кнопку.
  function onButtonCloseClick() {
    hideModalForm();
    removeOverlay();

    buttonClose.removeEventListener('click', onButtonCloseClick);
    document.removeEventListener('keydown', onEscKeydown);
    document.removeEventListener('click', onWindowClick);
  }
})();