// script.js
document.addEventListener("DOMContentLoaded", function () {
  const video = document.querySelector('.idiotbox video');
  const welcome = document.querySelector(".welcome");
const textbox = document.querySelector('.textbox');
let maxScroll = 0;
let targetTime = 0;
let isSeekingFromScroll = false;

// Update max scroll range
function updateMaxScroll() {
  maxScroll = textbox.scrollHeight - textbox.clientHeight;
}

window.addEventListener('load', updateMaxScroll);
window.addEventListener('resize', updateMaxScroll);

video.addEventListener('loadedmetadata', () => {
  const duration = video.duration;
  const picbox = document.querySelector('.picbox');
  const images = picbox.querySelectorAll('img');
  // Define your snap times
const imageTimePoints = [
  { time: 0, element: images[0] },
  { time: 45, element: images[1] },
  { time: 92, element: images[2] },
  { time: 140, element: images[3] },
  { time: 183, element: images[4] },
  { time: 198, element: images[5] },
  { time: 243, element: images[6] },
  { time: 295, element: images[7] },
  { time: 326, element: images[8] },
];

let lastSnapTime = -1;

video.addEventListener('timeupdate', () => {
  // Only check the current snap point — no loop flood
  const current = imageTimePoints
    .slice()  // make a shallow copy
    .reverse()  // so we can find the last matching snap point
    .find(pt => video.currentTime >= pt.time);

  if (current && current.time !== lastSnapTime) {
    lastSnapTime = current.time;
    picbox.scrollTo({
        top: current.element.offsetTop - picbox.offsetTop,
      behavior: 'auto'  // instant snap
    });
  }
});
picbox.addEventListener('wheel', e => e.preventDefault());
picbox.addEventListener('touchmove', e => e.preventDefault());

  // SCROLL CONTROLS VIDEO
  textbox.addEventListener('scroll', () => {
    // Prevent video time from overriding scroll during manual scroll
    isSeekingFromScroll = true;

    const scrollTop = textbox.scrollTop;
    const scrollFraction = scrollTop / maxScroll;
    targetTime = scrollFraction * duration;
  });

  // Easing function
  function easeSeek() {
    if (isSeekingFromScroll) {
      const diff = targetTime - video.currentTime;
      video.currentTime += diff * 0.01;  // Easing speed: increase to 0.2 for faster
    }
    requestAnimationFrame(easeSeek);
  }

  easeSeek();

  // VIDEO CONTROLS SCROLL
  video.addEventListener('timeupdate', () => {
    if (!isSeekingFromScroll) {
      const scrollFraction = video.currentTime / duration;
      const targetScroll = scrollFraction * maxScroll;

      textbox.scrollTo({
        top: targetScroll,
        behavior: 'auto'
      });
    }
  });

  // Reset flag after small delay — allows video to take over scroll again
  textbox.addEventListener('scrollend', () => {
    isSeekingFromScroll = false;
  });

  // Since `scrollend` is not widely supported yet, use a debounce:
  let scrollTimeout;
  textbox.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isSeekingFromScroll = false;
    }, 150); // Adjust time to taste — 150ms after scroll stops, video can control scroll again
  });

});
  welcome.addEventListener("click", function () {
    welcome.classList.remove("visible");
    video.play();
  });

  const appliedTimes = {};

  video.addEventListener("timeupdate", function () {
    const changesAtCurrentTime = classChanges.filter(
      change => video.currentTime >= change.time && !appliedTimes[change.time]
    );

    changesAtCurrentTime.forEach(change => {
      const elements = document.querySelectorAll(change.target);

      if (change.remove) {
        const removeClasses = Array.isArray(change.remove) ? change.remove : [change.remove];
        elements.forEach(el => removeClasses.forEach(cls => el.classList.remove(cls)));
      }

      if (change.add) {
        const addClasses = Array.isArray(change.add) ? change.add : [change.add];
        elements.forEach(el => addClasses.forEach(cls => el.classList.add(cls)));
      }

      appliedTimes[change.time] = true;
    });
  });
});


//this is kinda jank and runs bad, probably ram intensive with the overlays and wont run well on junky 'puters but hey it does what i want it to, albiet slowly and not very well scrolling site independantly is kinda werid