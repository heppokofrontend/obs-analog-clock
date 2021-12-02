import {status} from './utils/status';

// 設定まわり
type FromControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
const style = document.createElement('style');
const form = {
  size: document.querySelector<HTMLInputElement>('#f-size')!,
  url: document.querySelector<HTMLInputElement>('#f-url')!,
  css: document.querySelector<HTMLTextAreaElement>('#f-css')!,
  transitionHr: document.querySelector<HTMLSelectElement>('#f-transition-hr')!,
  transitionMin: document.querySelector<HTMLSelectElement>('#f-transition-min')!,
  transitionSec: document.querySelector<HTMLSelectElement>('#f-transition-sec')!,
};
const render = () => {
  const {$_GET} = status;

  form.size.value = (() => {
    const size = Number($_GET.size);
    const max = Number(form.size.max);
    const min = Number(form.size.min);

    if (
      !size ||
      !max ||
      !min
    ) {
      return '400';
    }

    if (max < size) {
      return form.size.max;
    }

    if (size < min) {
      return form.size.min;
    }

    return String(size);
  })();
  form.transitionHr.value = $_GET['transition-hr'] || 'on';
  form.transitionMin.value = $_GET['transition-min'] || 'on';
  form.transitionSec.value = $_GET['transition-sec'] || 'off';
  form.url.value = location.href;
  style.textContent = `
    .clock__item {
      width: ${form.size.value}px;
      height: ${form.size.value}px;
    }
  `;
  form.css.value = `
    html, body {
      overflow: hidden;
    }
    body:not(:root) {
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
    }
    h1, #time, .f-textfield {
      display: none;
    }
  `;
}
const handler = function (this: FromControl) {
  const {searchParams, origin, pathname} = new URL(location.href);
  const name = this.id.replace('f-', '');

  searchParams.set(name, this.value);
  history.replaceState('', '', `${origin}${pathname}?${searchParams.toString()}`);

  render();
};

for (const [_, formControl] of Object.entries(form)) {
  formControl.addEventListener('change', handler);
}

document.head.appendChild(style);
render();

export {};
