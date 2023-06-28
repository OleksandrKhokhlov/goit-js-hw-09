import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  valuesDates: document.querySelectorAll('.value'),
};
const { startBtn, valuesDates } = refs;

const timer = {
  isActiv: false,
  selectedTime: 0,
  start() {
    if (this.isActiv) {
      return;
    }
    const intervalID = setInterval(() => {
      const currentTime = Date.now();
      let ms = timer.selectedTime - currentTime;
      tikClockReverse(ms);

      if (Math.trunc(ms / 1000) === 0) {
        clearInterval(intervalID);
        startBtn.removeEventListener('click', timer.start);
      }
    }, 1000);
  },
};

function tikClockReverse(ms) {
  if (ms <= 0) {
    return;
  }
  const { days, hours, minutes, seconds } = convertMs(ms);
  valuesDates[0].textContent = `${days}`;
  valuesDates[1].textContent = `${hours}`;
  valuesDates[2].textContent = `${minutes}`;
  valuesDates[3].textContent = `${seconds}`;
  return { days, hours, minutes, seconds };
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    startBtn.addEventListener('click', timer.start);
    const currentDate = Date.now();
    timer.selectedTime = selectedDates[0].getTime();
    if (currentDate >= timer.selectedTime) {
      startBtn.setAttribute('disabled', 'disabled');
      Notify.warning('Please choose a date in the future', {
        width: '340px',
        position: 'center-center',
        cssAnimationStyle: 'zoom',
      });
      return;
    }
    startBtn.removeAttribute('disabled');
  },
};

flatpickr('#datetime-picker', options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}
