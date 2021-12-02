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
  const diff = Number($_GET.diff);
  const timeDiff = Number(diff * 1000 * 60 * 60) || 0;
  const date = new Date(Date.now() + timeDiff);
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

  time.textContent = `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')} JST ${
    diff < 0 ? `${String(diff).padStart(2, '0')}00` :
    0 < diff ? `+${String(diff).padStart(2, '0')}00` :
    ''
  }`;
  clock.sec.style.transform = `rotate(${sec * minSecRate + secTransition}deg)`;
  clock.min.style.transform = `rotate(${min * minSecRate + minTransition}deg)`;
  clock.hr.style.transform = `rotate(${hr * hourRate + hrTransition}deg)`;

  requestAnimationFrame(render);
}

render();

export {};
