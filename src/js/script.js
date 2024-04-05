import Swiper from "swiper/bundle";
import "swiper/css";
import AOS from "aos";
import "aos/dist/aos.css";
import { isWebp, isMobile } from "./modules/utils.js";
import { Analyse } from "./modules/Analyse.js";
isWebp();

const songBtn = document.querySelector(".sound-btn");
const lightBoxes = document.querySelectorAll(".box");
bgVideoIsReady(initScripts);

function bgVideoIsReady(fn) {
  songBtn.setAttribute("disabled", true);
  const videoElement = document.querySelector(".video-bg video");
  const intervalLoadingId = setInterval(() => {
    if (videoElement.buffered.length > 0) {
      let loadedPercentage =
        (videoElement.buffered.end(0) * 100) / videoElement.duration;

      document.querySelector(".loading-info").innerHTML = `${Math.ceil(
        loadedPercentage
      )}%`;
      if (loadedPercentage >= 95) {
        clearInterval(intervalLoadingId);
        fn();
      }
    }
  }, 500);
}
function initScripts() {
  const loader = document.querySelector(".loader");
  songBtn.removeAttribute("disabled");
  songBtn.classList.remove("loading");
  songBtn.addEventListener(
    "click",
    () => {
      loader.classList.remove("active");
      AOS.init({ duration: 800 });
      document.body.classList.add("active");
    },
    { once: true }
  );
  const lighShow = new LightShow(
    document.querySelectorAll(".discography__link")
  );
  songBtn.addEventListener("click", () => {
    loader.classList.remove("active");
    songBtn.classList.toggle("active");
    if (songBtn.classList.contains("active")) {
      bgAudio.play();
      lighShow.isAllowed = true;
    } else {
      bgAudio.pause();
      lighShow.isAllowed = false;
    }
  });
}

class LightShow {
  constructor(elements) {
    this.elemetsList = elements;
    this.isAllowed = songBtn.classList.contains("active");
    this.isDesktop = window.innerWidth > 768 && !isMobile.any();
    this.activeElement = null;
    this.canvas = document.getElementById("canvas");
    this.init();
  }
  init() {
    this.elemetsList.forEach((el) => {
      loadMedia(el);

      if (this.isDesktop) {
        el.addEventListener("mouseleave", (ev) => {
          if (this.isAllowed) {
            if (ev.target.nodeName == "SPAN") {
              return;
            }
            this.stop();
          }
        });
        el.addEventListener("mouseover", (ev) => {
          if (
            ev.target &&
            ev.relatedTarget &&
            (ev.target.nodeName == "SPAN" ||
              ev.relatedTarget.nodeName == "SPAN")
          ) {
            return;
          }
          if (this.isAllowed) {
            this.activeElement = el;
            this.canvas
              .getContext("2d")
              .drawImage(
                this.activeElement.img,
                0,
                0,
                this.canvas.width,
                this.canvas.height
              );
            this.canvas.className = "active";
            this.activeElement.img.classList.add("active");
            this.activeElement.addEventListener("mousemove", moveAlbumCover);
            this.play();
          }
        });
      } else {
        this.isActiveMobile = false;
        el.addEventListener("click", (e) => {
          e.preventDefault();
          if (this.isAllowed) {
            if (this.isActiveMobile) {
              this.stop();
              this.activeElement = el;
              if (this.isActiveMobile == this.activeElement) {
                this.isActiveMobile = false;
              } else {
                this.activeElement = el;
                this.isActiveMobile = el;
                this.play();
                mobileDrawAlbum.bind(this, e)();
              }
            } else {
              this.activeElement = el;
              this.isActiveMobile = el;
              this.play();
              mobileDrawAlbum.bind(this, e)();
            }
          }
        });
      }
    });
  }

  play() {
    if (this.activeElement) {
      for (let i = 0; i < 8; i++) {
        this.activeElement.parentMarquee.append(
          this.activeElement.marquee.cloneNode(true)
        );
      }
      this.activeElement.classList.add("active");
      colorBoxes(this.activeElement.dataset.colors);
      if (!this.activeElement.song) {
        this.activeElement.song = new Analyse(this.activeElement.audio);
      }
      this.activeElement.song.audio.addEventListener(
        "ended",
        function () {
          this.currentTime = 0;
          this.play();
        },
        false
      );
      bgAudio.pause();
      this.activeElement.song.audio.play();
      this.activeElement.song.intervalId = setInterval(() => {
        turnLightsOn(this.activeElement.song.bands);
      }, 20);
    }
  }
  stop() {
    this.canvas.className = "";
    bgAudio.play();
    this.activeElement.song.audio.pause();
    clearInterval(this.activeElement.song.intervalId);
    lightBoxes.forEach((e) => {
      e.style.background = `none`;
    });
    this.activeElement.img.classList.remove("active");
    if (this.isDesktop) {
      this.activeElement.removeEventListener("mousemove", moveAlbumCover);
    }
    this.activeElement.parentMarquee.replaceChildren();
    this.canvas.className = "";
    this.activeElement.parentMarquee.append(this.activeElement.marquee);
    this.activeElement.classList.remove("active");
  }
}

function moveAlbumCover(e) {
  if (this.img) {
    canvas.style.left = e.pageX + 20 + "px";
    canvas.style.top = e.pageY + 20 + "px";
  }
}
function colorBoxes(colorsString) {
  let lightMusic = colorsString.split(",").map((e) => "#" + e);
  lightBoxes.forEach((e, i) => {
    if (i == 0) {
      e.style.background = `radial-gradient(at top left,${lightMusic[0]} 0%,transparent 50%)  `;
    } else if (i == 1) {
      e.style.background = `radial-gradient(at top right,${lightMusic[1]} 0%,transparent 50%)  `;
    } else if (i == 2) {
      e.style.background = `radial-gradient(at bottom left,${lightMusic[2]} 0%,transparent 50%)  `;
    } else {
      e.style.background = `radial-gradient(at bottom right,${lightMusic[0]} 0%,transparent 50%)  `;
    }
  });
}
function turnLightsOn(numbers) {
  lightBoxes.forEach((e) => e.classList.remove("active"));
  if (numbers[0] > 230) {
    document.querySelector(".box.veryloud").classList.add("active");
  }
  if (numbers[25] > 90) {
    document.querySelector(".box.loud").classList.add("active");
  }
  if (numbers[190] > 40) {
    document.querySelector(".box.quiet").classList.add("active");
  }
  if (numbers[100] > 40) {
    document.querySelector(".box.middle").classList.add("active");
  }
}
function loadMedia(el) {
  el.marquee = el.querySelector(".marquee-text");
  el.parentMarquee = el.marquee.parentNode;
  el.audio = new Audio(el.dataset.song);
  el.audio.preload = "none";
  document.body.prepend(el.audio);
  el.img = new Image();
  el.img.src = el.dataset.img;
  el.img.className = "album-cover";
  document.querySelector(".cover-albums__container").prepend(el.img);
}
function mobileDrawAlbum(e) {
  this.canvas
    .getContext("2d")
    .drawImage(this.activeElement.img, 0, 0, canvas.width, canvas.height);
  this.canvas.style.left = e.pageX + 20 + "px";
  this.canvas.parentNode.setAttribute(
    "href",
    this.activeElement.getAttribute("href")
  );
  this.canvas.style.top = e.pageY + 20 + "px";
  this.activeElement.img.classList.add("active");
  this.canvas.className = "active";
}
const bgAudio = document.querySelector(".bg-song");
bgAudio.volume = 0.9;
bgAudio.addEventListener(
  "ended",
  function () {
    this.currentTime = 0;
    this.play();
  },
  false
);
const swiper2 = new Swiper(".slider-bio", {
  centeredSlides: true,
  speed: 1000,
  loop: true,
  breakpoints: {
    320: {
      slidesPerView: 2,
      spaceBetween: 20,
    },

    640: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    900: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
  },
});
