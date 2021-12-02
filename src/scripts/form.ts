import {status} from './utils/status';

// 設定まわり
type FromControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
const style = document.createElement('style');
const form = {
  size: document.querySelector<HTMLInputElement>('#f-size')!,
  transitionHr: document.querySelector<HTMLSelectElement>('#f-transition-hr')!,
  transitionMin: document.querySelector<HTMLSelectElement>('#f-transition-min')!,
  transitionSec: document.querySelector<HTMLSelectElement>('#f-transition-sec')!,
  diff: document.querySelector<HTMLInputElement>('#f-diff')!,
  url: document.querySelector<HTMLInputElement>('#f-url')!,
  css: document.querySelector<HTMLTextAreaElement>('#f-css')!,
};
const render = () => {
  const {$_GET} = status;

  form.size.value = $_GET.size || '400';
  form.transitionHr.value = $_GET['transition-hr'] || 'on';
  form.transitionMin.value = $_GET['transition-min'] || 'on';
  form.transitionSec.value = $_GET['transition-sec'] || 'off';
  form.diff.value = $_GET.diff || '0';
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
  `.replace(/^\s+|\n/gmu, '');
  form.url.value = location.href;
}
const handler = function (this: FromControl) {
  const {searchParams, origin, pathname} = new URL(location.href);
  const name = this.id.replace('f-', '');
  const value = (() => {
    const _val = Number(this.value);

    if (
      _val &&
      'max' in this &&
      'min' in this
    ) {
      const max = Number(this.max);
      const min = Number(this.min);

      if (max < _val) {
        return this.max;
      }

      if (_val < min) {
        return this.min;
      }

      return String(_val);
    }

    return '';
  })();

  if (value) {
    searchParams.set(name, value);
  } else {
    searchParams.delete(name);
  }

  history.replaceState('', '', `${origin}${pathname}?${searchParams.toString()}`);

  render();
};

for (const [_, formControl] of Object.entries(form)) {
  formControl.addEventListener('change', handler);
}

document.head.appendChild(style);
render();

export {};
