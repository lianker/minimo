export class Timer {
  constructor() {
    var $ = document.querySelector.bind(document);

    this.key = "timer";
    this.timerSpan = $("#timer");
    this.timerKey = $("#timer-key");
    this.btnStart = $("#btn-start-timer");
    this.btnStop = $("#btn-stop-timer");

    this.timeListener = null;

    this.atachEvent();
  }

  start() {
    let timer = JSON.parse(localStorage.getItem(this.key));

    if (!timer) timer = { seconds: 0, enabled: true };

    timer.enabled = true;
    localStorage.setItem(this.key, JSON.stringify(timer));
    this.run(timer);
  }

  cleanListener() {
    clearInterval(this.timeListener);
    this.timeListener = null;
  }

  parseSecondsToHours(seconds) {
    const addZeroLeft = numberToParse => numberToParse.toString().padStart(2, "0");

    const hour = addZeroLeft(Math.trunc(seconds / 3600, 10));
    const minute = addZeroLeft(Math.trunc((seconds % 3600) / 60, 10));
    const second = addZeroLeft((seconds % 3600) % 60, 10);

    return `${hour}:${minute}:${second}`;
  }

  clear() {
    const timer = JSON.parse(localStorage.getItem(this.key));
    timer.seconds = 0;
    localStorage.setItem(this.key, JSON.stringify(timer));
  }

  atachEvent() {
    window.addEventListener("storage", e => {
      if (e.key === this.key) this.updateScreen(JSON.parse(e.newValue));
    });
  }

  updateScreen(timer) {
    this.timerSpan.innerHTML = this.parseSecondsToHours(timer.seconds);
    this.timerKey.innerHTML = timer.key;
  }

  isStopped() {
    let timer = JSON.parse(localStorage.getItem(this.key));
    return !timer.enabled;
  }

  stop() {
    this.cleanListener();
    let timer = JSON.parse(localStorage.getItem(this.key));
    timer.enabled = false;
    localStorage.setItem(this.key, JSON.stringify(timer));
  }

  run(timer) {
    this.cleanListener();
    this.timeListener = setInterval(() => {
      if (this.isStopped()) this.stop();

      timer.seconds++;

      this.updateScreen(timer);
      localStorage.setItem(this.key, JSON.stringify(timer));
    }, 1000);
  }
}

(function() {
  window.timer = new Timer();
})();
