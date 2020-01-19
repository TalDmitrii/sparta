'use strict';

(function () {
  var SUCCESS_RESPONSE_STATUS = 200;

  // Отправляет данные на сервер.
  // @param {object} data - Содержит данные формы, которые будут отправлены на сервер.
  // @param {function} onLoad - Функция обратного вызова, которая срабатывает при успешном выполнении запроса.
  // @param {function} onError - Функция обратного вызова, которая срабатывает при неуспешном выполнении запроса.
  function upload(data, onLoad, onError) {
    var URL = 'https://echo.htmlacademy.ru';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_RESPONSE_STATUS) {
        onLoad(xhr.status);
      } else {
        onError(xhr);
      }
    });

    xhr.open('POST', URL);
    xhr.send(data);
  }

  // Экспортирует в глобальную область видимости функции для взаимодействия с удаленным севером через XHR.
  window.backend = {
    upload: upload
  };
})();

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

'use strict';

(function () {
  var forms = document.querySelectorAll('.js-form');

  if (!forms) return;

  forms.forEach(function(form) {
    var inputs = form.querySelectorAll('input');

    // Обработка полей формы.
    // 
    // Добавляет всем полям формы обработчик события.
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('input', onInputCheck);
    }

    // Проверяет поля с задержкой, даёт отработать маске полей.
    function onInputCheck(evt) {
      setTimeout(function () {
        // Проверка полей ввода, и смена цвета рамок этих полей, в зависимости от валидности.
        var input = evt.target;
        var inputParent = input.parentElement;

        // Если значение поля верно.
        if (input.validity.valid === true) {
          if (!inputParent.classList.contains('form__label--valid')) {
            inputParent.classList.add('form__label--valid');
          }
        }

        // Если значение поля неверно и оно не пустое.
        if ((input.validity.valid === false) && (input.value.length > 0) ) {
          if (inputParent.classList.contains('form__label--valid')) {
            inputParent.classList.remove('form__label--valid');
          }
        }

        // Если значение поля стало пустым, удаляет классы статуса поля.
        if (input.value.length === 0) {
          if (inputParent.classList.contains('form__label--valid')) {
            inputParent.classList.remove('form__label--valid');
          }
        }
      }, 100);
    }
  });
})();
'use strict';

(function () {


  // function closeMenu() {
  //   mainNavigation.classList.remove('main-navigation--opened');

  //   navigationToggle.classList.remove('menu-toggle--opened');
  //   navigationToggle.classList.add('menu-toggle--closed');

  //   bodyScrollLock.enableBodyScroll(mainNavigation);
  //   mainNavigation.removeEventListener('click', onLinkClickHandler);
  // }

  // function openMenu() {
  //   mainNavigation.classList.add('main-navigation--opened');

  //   if (navigationToggle.classList.contains('menu-toggle--closed')) {
  //     navigationToggle.classList.remove('menu-toggle--closed');
  //   }
  //   navigationToggle.classList.add('menu-toggle--opened');
    
  //   bodyScrollLock.disableBodyScroll(mainNavigation);
  //   mainNavigation.addEventListener('click', onLinkClickHandler);
  // }
})();

'use strict';

(function() {
  if ($('.js-phone-mask').length) {
    $('.js-phone-mask').inputmask({
      "mask": "+7 (999) 999-99-99",
      "placeholder": "+7 (___) ___-__-__",
      "showMaskOnHover": false
    });
  }
})();

'use strict';

(function () {
  var page = document.querySelector('body');
  var orderButtons = page.querySelectorAll('.order-button-js');
  var modalFormContainer = page.querySelector('.modal-form-js');
  var ESC_CODE = 27;

  if (!orderButtons && !orderButtons && !modalFormContainer) {
    return;
  }

  var modalForm = modalFormContainer.querySelector('.js-form');
  var inputs = modalForm.querySelectorAll('input');
  var buttonClose = modalFormContainer.querySelector('.modal-button-js');

  // Добавляет обработчик на каждую кнопку для заказа.
  orderButtons.forEach(function(button) {
    button.addEventListener('click', function(evt) {
      evt.preventDefault();

      showOverlay();
      showModalForm();
    });
  });

  // Показывает форму, добавляет к ней обработчики.
  function showModalForm() {
    modalFormContainer.classList.remove('modal-form--hide');

    if (!modalFormContainer.classList.contains('modal-form--show')) {
      modalFormContainer.classList.add('modal-form--show');
    }

    // Обработчик закрывает форму при клике по кнопке.
    buttonClose.addEventListener('click', onButtonCloseClick);

    // Обработчик закрывает форму по ESC.
    document.addEventListener('keydown', onEscKeydown);
    
    // Обработчик закрывает форму при клике по произвольной области.
    document.addEventListener('click', onWindowClick);
  }
  
  // Скрывает форму.
  function hideModalForm() {
    modalFormContainer.classList.remove('modal-form--show');

    if (!modalFormContainer.classList.contains('modal-form--hide')) {
      modalFormContainer.classList.add('modal-form--hide');
    }
  }

  // Отправляет данные формы.
  modalForm.addEventListener('submit', function (evt) {
    // Сбрасывает стандартное поведение формы.
    evt.preventDefault();

    window.backend.upload(new FormData(modalForm), successUploadForm, errorUploadForm);
  });

  // Функция сообщает о неуспешной попытке загрузки данных.
  function errorUploadForm() {
    // Закрывает форму.
    hideModalForm();

    // Сбрасывает все значения формы.
    setCustomValue();

    // Показывает сообщение об удачной попытке загрузки данных.
    renderMessage(false);
  }

  // Функция сообщает об успешной попытке загрузки данных.
  function successUploadForm() {
    // Закрывает форму.
    hideModalForm();

    // Сбрасывает все значения формы.
    setCustomValue();

    // Показывает сообщение об удачной попытке загрузки данных.
    renderMessage(true);   
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

  // Удаляет информационное сообщение.
  function removeMessage() {
    window.modalMessage.removeMessage();
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

  // Закрывает форму по ESC.
  function onEscKeydown(evt) {
    if (evt.keyCode === ESC_CODE) {
      onButtonCloseClick();
    }
  }

  // Закрывает форму при клике по произвольной области.
  function onWindowClick(evt) {
    var target = evt.target;

    if (target.classList.contains('overlay')) {
      onButtonCloseClick();
    }
  }

  // Закрывает форму по клику на кнопку.
  function onButtonCloseClick() {
    setTimeout(removeOverlay, 200);
    setTimeout(hideModalForm, 200);

    window.modalMessage.removeMessage();

    buttonClose.removeEventListener('click', onButtonCloseClick);
    document.removeEventListener('keydown', onEscKeydown);
    document.removeEventListener('click', onWindowClick);
  }
})();
'use strict';

(function () {
  var page = document.querySelector('body');
  var myMessage;

  function renderMessage(isSuccess) {
    var title;
    var successTitle = 'Отлично!<br> Медведи уже ждут тебя...';
    var errorTitle = 'Ошибка.<br> Попробуй ещё раз.';
    myMessage = document.createElement('div');
    myMessage.classList.add('modal-message');

    if (isSuccess) {
      title = successTitle;
    } else {
      title = errorTitle;
    }
    
    myMessage.innerHTML = 
      '<div class="modal-message__content">' +
        '<h2 class="modal-message__title">' + title + '</h2>' +
        '<button type="button" class="modal-message__button" title="Закрыть"></button>' +
      '</div>';

    page.appendChild(myMessage);
  }

  function removeMessage() {
    if (myMessage) {
      myMessage.classList.add('modal-message--hide');

      setTimeout(function () {
        page.removeChild(myMessage);
        myMessage = null;
      }, 800);
    }
  }

  function onButtonClick(callback) {
    var buttonClose = myMessage.querySelector('.modal-message__button');

    buttonClose.addEventListener('click', callback);
  }

  window.modalMessage = {
    renderMessage: renderMessage,
    removeMessage: removeMessage,
    onButtonClick: onButtonClick,
  }
})();
'use strict';

(function () {
  var overlay = document.querySelector('.overlay');

  if (!overlay) {
    return;
  }

  function showOverlay() {
    overlay.classList.remove('overlay--hide');

    if (!overlay.classList.contains('overlay--show')) {
      overlay.classList.add('overlay--show');
    }
  }
  
  function hideOverlay() {
    overlay.classList.remove('overlay--show');

    if (!overlay.classList.contains('overlay--hide')) {
      overlay.classList.add('overlay--hide');
    }
  }

  window.overlay = {
    showOverlay: showOverlay,
    hideOverlay: hideOverlay,
  }
})();
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
'use strict';

(function () {
  var mySlider = new Swiper('.slider-js', {
    autoHeight: true,
    slidesPerView: 1,
    spaceBetween: 50,
    updateOnWindowResize: true,
    loop: true,
    
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
})();
