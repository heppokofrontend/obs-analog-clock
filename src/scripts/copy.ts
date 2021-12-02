const handler = function (this: HTMLInputElement | HTMLTextAreaElement) {
  this.select();
};
const targets = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.js-copy');

for (const textfield of targets) {
  textfield.addEventListener('focus', handler);
}

export {};
