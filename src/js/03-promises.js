import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formRef = document.querySelector('form');
const dataUser = {};

formRef.addEventListener('submit', onFormSubmit);
formRef.addEventListener('input', onFormInput);

function createPromise(position, delay) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        // Fulfill
        res({ position, delay });
      } else {
        // Reject
        rej({ position, delay });
      }
    }, delay);
  });
}

function onFormSubmit(evt) {
  evt.preventDefault();

  let delay = Number(dataUser['delay']);

  for (let position = 1; position <= dataUser['amount']; position += 1) {
    const step = Number(dataUser['step']);

    createPromise(position, delay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });

    delay += step;
  }
}

function onFormInput(evt) {
  dataUser[evt.target.name] = evt.target.value;
}
