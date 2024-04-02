import Swiper from "swiper/bundle";
import "swiper/css";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  eraseCookie,
  Analyse,
  createCookie,
  readCookie,
  isWebp,
  isMobile,
} from "./modules/utils.js";
isWebp();

let songBtn = document.querySelector(".sound-btn");
const videoElement = document.querySelector(".video-bg video");
songBtn.setAttribute("disabled", true);
let intervalLoadingId = setInterval(() => {
  if (videoElement.buffered.length > 0) {
    let loadedPercentage =
      (videoElement.buffered.end(0) * 100) / videoElement.duration;

    document.querySelector(".loading-info").innerHTML = `${Math.ceil(
      loadedPercentage
    )}%`;
    if (loadedPercentage >= 95) {
      clearInterval(intervalLoadingId);
      songBtn.removeAttribute("disabled");
      songBtn.classList.remove("loading");
      songBtn.addEventListener(
        "click",
        () => {
          document.querySelector(".loader").classList.remove("active");
          AOS.init({ duration: 800 });
          document.body.classList.add("active");
        },
        { once: true }
      );
      const s = new LightShow(document.querySelectorAll(".discography__link"));
      songBtn.addEventListener("click", () => {
        document.querySelector(".loader").classList.remove("active");
        songBtn.classList.toggle("active");

        if (songBtn.classList.contains("active")) {
          bgAudio.play();
          s.isAllowed = true;
        } else {
          bgAudio.pause();

          s.isAllowed = false;
        }
      });
      songBtn.addEventListener(
        "click",
        () => {
          AOS.init();
          document.body.classList.add("active");
        },
        { once: true }
      );
    }
  }
}, 500);

let bgAudio = document.querySelector(".bg-song");
bgAudio.volume = 0.9;
bgAudio.addEventListener(
  "ended",
  function () {
    this.currentTime = 0;
    this.play();
  },
  false
);

function fn(e) {
  if (this.img) {
    canvas.style.left = e.pageX + 20 + "px";
    canvas.style.top = e.pageY + 20 + "px";
  }
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
      el.marquee = el.querySelector(".marquee-text");
      el.parentMarquee = el.marquee.parentNode;
      el.audio = new Audio(el.dataset.song);
      el.audio.preload = "none";
      document.body.prepend(el.audio);
      el.img = new Image();
      el.img.src = el.dataset.img;
      el.img.className = "album-cover";
      document.querySelector(".cover-albums__container").prepend(el.img);
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
            this.activeElement.addEventListener("mousemove", fn);
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
                this.canvas
                  .getContext("2d")
                  .drawImage(
                    this.activeElement.img,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                  );
                this.canvas.style.left = e.pageX + 20 + "px";
                this.canvas.parentNode.setAttribute(
                  "href",
                  this.activeElement.getAttribute("href")
                );
                this.canvas.style.top = e.pageY + 20 + "px";
                this.activeElement.img.classList.add("active");
                this.canvas.className = "active";
              }
            } else {
              this.activeElement = el;
              this.isActiveMobile = el;
              this.play();
              this.canvas
                .getContext("2d")
                .drawImage(
                  this.activeElement.img,
                  0,
                  0,
                  this.canvas.width,
                  this.canvas.height
                );
              this.canvas.style.left = e.pageX + 20 + "px";
              this.canvas.parentNode.setAttribute(
                "href",
                this.activeElement.getAttribute("href")
              );
              this.canvas.style.top = e.pageY + 20 + "px";
              this.activeElement.img.classList.add("active");
              canvas.className = "active";
            }
          }
        });
      }
    });
  }

  play() {
    if (this.activeElement) {
      // set MARQUEE
      for (let i = 0; i < 8; i++) {
        this.activeElement.parentMarquee.append(
          this.activeElement.marquee.cloneNode(true)
        );
      }
      this.activeElement.classList.add("active");
      // set COLORS
      let lightMusic = this.activeElement.dataset.colors
        .split(",")
        .map((e) => "#" + e);
      document.querySelectorAll(".box").forEach((e, i) => {
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
      // start media
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
        lightBoxes(this.activeElement.song.bands);
      }, 20);
    }
  }
  stop() {
    this.canvas.className = "";
    bgAudio.play();
    this.activeElement.song.audio.pause();
    clearInterval(this.activeElement.song.intervalId);
    document.querySelectorAll(".box").forEach((e) => {
      e.style.background = `none`;
    });
    this.activeElement.img.classList.remove("active");
    if (this.isDesktop) {
      this.activeElement.removeEventListener("mousemove", fn);
    }
    this.activeElement.parentMarquee.replaceChildren();
    this.canvas.className = "";
    this.activeElement.parentMarquee.append(this.activeElement.marquee);
    this.activeElement.classList.remove("active");
  }
}

function lightBoxes(numbers) {
  document
    .querySelectorAll(".box")
    .forEach((e) => e.classList.remove("active"));

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
const swiper2 = new Swiper(".slider-bio", {
  // autoplay: true,
  centeredSlides: true,
  speed: 1000,
  loop: true,
  breakpoints: {
    // when window width is >= 320px
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
