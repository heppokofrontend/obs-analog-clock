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
const minAdjustRate = minSecRate / 60;
const hourAdjustRate = hourRate / 60;
const render = () => {
  const {$_GET} = status;
  const date = new Date();
  const sec = date.getSeconds();
  const min = date.getMinutes();
  const hr = date.getHours();
  const msForTransition = date.getMilliseconds() / 1000 * minSecRate;
  const secTransition = $_GET['transition-sec'] === 'on' ? // default off
    msForTransition :
    0;
  const minTransition = $_GET['transition-min'] !== 'off' ? // default on
    sec * minAdjustRate + (msForTransition / 60) :
    0;
  const hrTransition = $_GET['transition-hr'] !== 'off' ? // default on
    min * hourAdjustRate :
    0;

  time.textContent = date.toString();
  clock.sec.style.transform = `rotate(${sec * minSecRate + secTransition}deg)`;
  clock.min.style.transform = `rotate(${min * minSecRate + minTransition}deg)`;
  clock.hr.style.transform = `rotate(${hr * hourRate + hrTransition}deg)`;

  requestAnimationFrame(render);
}

render();

export {};
