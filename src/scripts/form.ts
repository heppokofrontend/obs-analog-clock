import {status} from './utils/status';

// 設定まわり
type FromControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
const style = document.createElement('style');
const form = {
  size: document.querySelector<HTMLInputElement>('#f-size')!,
  rotateX: document.querySelector<HTMLInputElement>('#f-rotate-x')!,
  rotateY: document.querySelector<HTMLInputElement>('#f-rotate-y')!,
  rotateZ: document.querySelector<HTMLInputElement>('#f-rotate-z')!,
  transitionHr: document.querySelector<HTMLSelectElement>('#f-transition-hr')!,
  transitionMin: document.querySelector<HTMLSelectElement>('#f-transition-min')!,
  transitionSec: document.querySelector<HTMLSelectElement>('#f-transition-sec')!,
  scale: document.querySelector<HTMLInputElement>('#f-scale')!,
  diff: document.querySelector<HTMLInputElement>('#f-diff')!,
  url: document.querySelector<HTMLInputElement>('#f-url')!,
  css: document.querySelector<HTMLTextAreaElement>('#f-css')!,
};
const render = () => {
  const {$_GET} = status;

  form.size.value = $_GET.size || '400';
  form.rotateX.value = $_GET['rotate-x'] || '0';
  form.rotateY.value = $_GET['rotate-y'] || '0';
  form.rotateZ.value = $_GET['rotate-z'] || '0';
  form.transitionHr.value = $_GET['transition-hr'] || 'on';
  form.transitionMin.value = $_GET['transition-min'] || 'on';
  form.transitionSec.value = $_GET['transition-sec'] || 'off';
  form.scale.value = $_GET.scale || '100';
  form.diff.value = $_GET.diff || '9';
  style.textContent = `
    .p-clock__inner {
      ${
        (
          $_GET['rotate-x'] ||
          $_GET['rotate-y'] ||
          $_GET['rotate-z'] ||
          $_GET.scale
        ) ? (
          `transform: ${
            [
              $_GET['rotate-x'] ? `rotateX(${$_GET['rotate-x']}deg)` : '',
              $_GET['rotate-y'] ? `rotateY(${$_GET['rotate-y']}deg)` : '',
              $_GET['rotate-z'] ? `rotateZ(${$_GET['rotate-z']}deg)` : '',
              $_GET.scale ? `scale(${Number($_GET.scale) / 100})` : '',
            ].join(' ')
          }`
        ) : ''
      }
    }
    .p-clock__item {
      width: ${form.size.value}px;
      height: ${form.size.value}px;
    }
  `;
  form.css.value = `
    html, body {
      overflow: hidden !important;
    }
    body:not(:root) {
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: transparent !important;
    }
    .l-main__preview > *:not(#clock),
    .l-main__form,
    .l-footer {
      display: none !important;
    }
    .l-main {
      display: block !important;
    }
    .l-main__preview {
      position: static !important;
      padding: 0 !important;
    }
    #clock {
      margin-bottom: 0 !important;
    }
  `.replace(/^\s+|\n/gmu, '');
  form.url.value = location.href;
}
const handler = function (this: FromControl) {
  const {searchParams, origin, pathname} = new URL(location.href);
  const name = this.id.replace('f-', '');
  const value = (() => {
    if (this.tagName.toLocaleLowerCase() === 'select') {
      return this.value;
    }

    const _val = Number(this.value);

    if (
      !isNaN(_val) &&
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

  if (value === '') {
    searchParams.delete(name);
  } else {
    searchParams.set(name, value);
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
