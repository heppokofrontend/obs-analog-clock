import {status} from './utils/status';

// 設定まわり
type FromControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
const style = document.createElement('style');
const form = {
  size: document.querySelector<HTMLInputElement>('#f-size')!,
  url: document.querySelector<HTMLInputElement>('#f-url')!,
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
  form.transitionSec.value = $_GET['transition-sec'] || 'off';
  form.url.value = location.href;
  style.textContent = `
    .clock__item {
      width: ${form.size.value}px;
      height: ${form.size.value}px;
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
