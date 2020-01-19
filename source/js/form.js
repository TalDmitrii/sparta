'use strict';

(function () {
  var page = document.querySelector('body');
  var form = page.querySelector('.js-form');

  if (!form) {
    return;
  }

  var inputs = form.querySelectorAll('input');
  var ESC_CODE = 27;


  // Отправляет данные формы.
  form.addEventListener('submit', function (evt) {
    // Сбрасывает стандартное поведение формы.
    evt.preventDefault();

    window.backend.upload(new FormData(form), successUploadForm, errorUploadForm);
  });

  // Функция сообщает о неуспешной попытке загрузки данных.
  function errorUploadForm() {
    // Показывает оверлей.
    showOverlay();

    // Показывает сообщение о неудачной попытке загрузки данных.
    renderMessage(false);

    // Сбрасывает все значения формы.
    setCustomValue();
  }

  // Функция сообщает об успешной попытке загрузки данных.
  function successUploadForm() {
    // Показывает оверлей.
    showOverlay();

    // Показывает сообщение об удачной попытке загрузки данных.
    renderMessage(true);

    // Сбрасывает все значения формы.
    setCustomValue();
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

  // Удаляет информационное сообщение.
  function removeMessage() {
    window.modalMessage.removeMessage();
  }

  // Сбрасывает все значения формы на начальные.
  function setCustomValue() {
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].parentNode.classList.remove('form__label--valid');
      inputs[i].value = '';
      inputs[i].blur();
    }
  }

  // Создаёт сообщение о загрузке данных из формы, добавляет обработчики закрытия сообщения.
  // @param {bool} isSuccess - Статус сообщения: отправлено или нет.
  function renderMessage(isSuccess) {
    // Создаёт сообщение на основе шаблона в зависимости от статуса 'успешно/неуспешно'.
    window.modalMessage.renderMessage(isSuccess);

    // Обработчик закрывает сообщение об отправке данных по ESC.
    document.addEventListener('keydown', onEscKeydown);

    // Обработчик закрывает сообщение об отправке данных при клике по произвольной области.
    document.addEventListener('click', onWindowClick);

    // Обработчик закрывает сообщение об отправке данных при клике по кнопке.
    window.modalMessage.onButtonClick(onButtonCloseClick);
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
    setTimeout(removeOverlay, 400);
    setTimeout(removeMessage, 400);

    document.removeEventListener('keydown', onEscKeydown);
    document.removeEventListener('click', onWindowClick);
  }
})();
