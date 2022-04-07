export class Vh {
  constructor() {
    window.addEventListener('resize', this.setFillHeight);

    this.setFillHeight();
  }

  setFillHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
