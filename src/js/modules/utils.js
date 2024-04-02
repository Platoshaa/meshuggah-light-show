export function createCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = "; expires=" + date.toGMTString();
  } else var expires = "";
  document.cookie = name + "=" + value + expires + "; path=/";
}
export function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0)
      return c.substring(nameEQ.length, c.length);
  }
  return null;
}
export function eraseCookie(name) {
  createCookie(name, "", -1);
}
export var Analyse = function (audio) {
  var an = this,
    AudioContext = window.AudioContext || window.webkitAudioContext;

  //Создание источника
  this.audio = audio;
  //Создаем аудио-контекст
  this.context = new AudioContext();
  this.node = this.context.createScriptProcessor(2048, 1, 1);
  //Создаем анализатор
  this.analyser = this.context.createAnalyser();
  this.analyser.smoothingTimeConstant = 0;
  this.analyser.fftSize = 512;
  let bufferLength = this.analyser.frequencyBinCount;

  this.bands = new Uint8Array(bufferLength);
  //Подписываемся на событие
  // this.audio.addEventListener("canplay", function () {
  //   //отправляем на обработку в  AudioContext
  //   console.log("helo");
  an.source = an.context.createMediaElementSource(an.audio);
  //связываем источник и анализатором
  an.source.connect(an.analyser);
  //связываем анализатор с интерфейсом, из которого он будет получать данные
  an.analyser.connect(an.node);
  //Связываем все с выходом
  an.node.connect(an.context.destination);
  an.source.connect(an.context.destination);
  //подписываемся на событие изменения входных данных
  an.node.onaudioprocess = function () {
    an.analyser.getByteFrequencyData(an.bands);
    if (!an.audio.paused) {
      if (typeof an.update === "function") {
        return an.update(an.bands);
      } else {
        return 0;
      }
    }
  };
  // });

  return this;
};
export function isWebp() {
  // Проверка поддержки webp
  window.addEventListener("load", () => {});
  function testWebp(callback) {
    let webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }

  // Добавление класса _webp или _no-webp для HTML
  testWebp(function (support) {
    let className = support === true ? "webp" : "no-webp";
    document.documentElement.classList.add(className);
  });
}
export const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};
