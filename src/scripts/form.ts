import {status} from './utils/status';

// 設定まわり
type FromControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
const style = document.createElement('style');
const layers = {
  wrap: document.getElementById('layer-order')!,
  items: Object.fromEntries(
    [...document.querySelectorAll<HTMLLIElement>('.js-layer')].map(l => {
      const id = l.dataset.id;

      return [id, l];
    })
  ) as {
    [x: string]: HTMLLIElement
  },
  cache: '',
};
/**
 * prefixを外して残りをキャメルケースにして返します
 * @param id - FormControlのid属性値
 * @returns - 整形した値
 */
const makeId = (id: string) => {
  const name = id.replace('f-', '');

  return name.replace(/-(.)/ug, (_, p1) => p1.toUpperCase());
};
/** FormControlのNodeセット */
const form = Object.fromEntries(
  [...document.querySelectorAll<FromControl>('[id^="f-"]')].map(elm => {
    return [makeId(elm.id), elm];
  })
);
const base = document.querySelector<HTMLImageElement>('#base')!;
const render = () => {
  const {$_GET} = status;
  const layerParam: string = $_GET['layer'] || '';
  const layerOrder = layerParam.split(',');

  style.textContent = '';

  // レイヤーソート
  if (layerOrder.length === 4) {
    layerOrder.forEach((id, idx) => {
      style.textContent += `
        #${id} {
          z-index: ${4 - idx};
        }
      `;
    });

    if (layers.cache !== layerParam) {
      const f = document.createDocumentFragment();

      for (const id of layerOrder) {
        f.append(layers.items[id]);
      }

      layers.wrap.append(f);
      layers.cache = layerParam;
    }
  }

  form.bg.value = $_GET['bg'] || 'on';
  form.opacityHr.value = $_GET['opacity-hr'] || '100';
  form.opacityMin.value = $_GET['opacity-min'] || '100';
  form.opacitySec.value = $_GET['opacity-sec'] || '100';
  form.opacityBase.value = $_GET['opacity-base'] || '100';
  form.size.value = $_GET.size || String(base.naturalWidth < 1200 ? base.naturalWidth : 1200);
  form.rotateX.value = $_GET['rotate-x'] || '0';
  form.rotateY.value = $_GET['rotate-y'] || '0';
  form.rotateZ.value = $_GET['rotate-z'] || '0';
  form.moveX.value = $_GET['move-x'] || '0';
  form.moveY.value = $_GET['move-y'] || '0';
  form.transitionHr.value = $_GET['transition-hr'] || 'on';
  form.transitionMin.value = $_GET['transition-min'] || 'on';
  form.transitionSec.value = $_GET['transition-sec'] || 'off';
  form.scale.value = $_GET.scale || '100';
  form.diff.value = $_GET.diff || '9';
  style.textContent += `
    #clock {
      ${
        $_GET['bg'] === 'off' ?
        'background: transparent !important;' :
        ''
      }
    }
    .p-clock__inner {
      ${
        (
          $_GET['rotate-x'] ||
          $_GET['rotate-y'] ||
          $_GET['rotate-z'] ||
          $_GET.scale ||
          $_GET['move-x'] ||
          $_GET['move-y']
        ) ? (
          `transform: ${
            [
              $_GET['move-x'] ? `translateX(${$_GET['move-x']}px)` : '',
              $_GET['move-y'] ? `translateY(${$_GET['move-y']}px)` : '',
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
    ${
      $_GET['opacity-hr'] ? `#hr {opacity: ${Number($_GET['opacity-hr']) / 100};}` : ''
    }
    ${
      $_GET['opacity-min'] ? `#min {opacity: ${Number($_GET['opacity-min']) / 100};}` : ''
    }
    ${
      $_GET['opacity-sec'] ? `#sec {opacity: ${Number($_GET['opacity-sec']) / 100};}` : ''
    }
    ${
      $_GET['opacity-base'] ? `#base {opacity: ${Number($_GET['opacity-base']) / 100};}` : ''
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
const replaceState = (name: string, value: string) => {
  const {searchParams, origin, pathname} = new URL(location.href);

  if (value === '') {
    searchParams.delete(name);
  } else {
    searchParams.set(name, value);
  }

  history.replaceState('', '', `${origin}${pathname}?${searchParams.toString()}`);
};
const handler = function (this: FromControl) {
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
      const max = Number(this.max || NaN);
      const min = Number(this.min || NaN);

      if (
        !Number.isNaN(max) &&
        max < _val
      ) {
        return this.max;
      }

      if (
        !Number.isNaN(min) &&
        _val < min
      ) {
        return this.min;
      }

      return String(_val);
    }

    return '';
  })();

  replaceState(name, value);
  render();
};

// layer
for (const layer of Object.values(layers.items)) {
  const btns = layer.querySelectorAll('.js-btn-layer');
  const click = function (this: HTMLButtonElement) {
    if (this.dataset.move === 'up') {
      layer.previousElementSibling?.before(layer);
    } else {
      layer.nextElementSibling?.after(layer);
    }

    replaceState(
      'layer',
      [...layer.parentElement?.children || '']?.map(
        (li: any) => li?.dataset?.id
      ).join(',')
    );
    render();
    this.focus();
  }

  for (const btn of btns) {
    btn.addEventListener('click', click);
  }
}

// forms
for (const [_, formControl] of Object.entries(form)) {
  if (formControl.type === 'range') {
    let drag = false;

    formControl.addEventListener('mousedown', () => drag = true);
    formControl.addEventListener('mousemove', () => {
      if (drag) {
        handler.call(formControl);
      }
    });
    window.addEventListener('mouseup', () => drag = false);
  }

  formControl.addEventListener('change', handler);
}

document.head.appendChild(style);
window.addEventListener('load', render);

export {};
