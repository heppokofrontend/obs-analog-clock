// 画面クリックでツールチップを閉じる
const tooltips = document.querySelectorAll<HTMLDetailsElement>([
  '.p-form-control__help',
  '.p-layer-control__help'
].join(','));
const stopPropagation = (e: Event) => e.stopPropagation();

document.body.addEventListener('click', () => {
  for (const tooltip of tooltips) {
    tooltip.open = false;
    tooltip.addEventListener('click', stopPropagation);
  }
});
