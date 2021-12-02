// 時計
import {status} from './utils/status';

const time = document.getElementById('time')!;
const clock = {
  base: document.getElementById('base')!,
  hr: document.getElementById('hr')!,
  min: document.getElementById('min')!,
  sec: document.getElementById('sec')!,
};
const minSecRate = 360 / 60;
const hourRate = 360 / 12;
const hourAdjustRate = hourRate / 60;
const render = () => {
  const {$_GET} = status;
  const date = new Date();
  const sec = date.getSeconds();
  const min = date.getMinutes();
  const hr = date.getHours();
  const secTransition = $_GET['transition-sec'] === 'on' ?
    date.getMilliseconds() / 1000 * minSecRate :
    0;

  time.textContent = date.toString();
  clock.sec.style.transform = `rotate(${sec * minSecRate + secTransition}deg)`;
  clock.min.style.transform = `rotate(${min * minSecRate}deg)`;
  clock.hr.style.transform = `rotate(${hr * hourRate + (min * hourAdjustRate)}deg)`;

  requestAnimationFrame(render);
}

render();

export {};
