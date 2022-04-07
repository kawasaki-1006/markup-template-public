import { ScrollSwitch } from './ScrollSwitch';

/** !
 * @class NavToggle
 * @description SP時のトグルの処理
 */
export class NavToggle {
  private readonly selector: HTMLElement | null = document.querySelector('[data-nav-toggle]');
  constructor() {
    if (this.selector === null) return;
    this.eventHandler().then();
  }

  private async eventHandler(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (this.selector === null) {
        reject();
        return;
      }
      this.selector.addEventListener('click', async (event) => await this.onClick(event));
      document.addEventListener('keyup', async (event) => {
        if (this.selector === null) {
          reject();
          return;
        }
        if (event.code !== 'Escape' || this.selector.getAttribute('aria-expanded') !== 'true') {
          reject();
          return;
        }
        this.selector.click();
      });
      resolve();
    });
  }

  private async onClick(event: Event): Promise<void> {
    event.preventDefault();
    await new Promise<void>((resolve, reject) => {
      const thisElm: EventTarget | null = event.currentTarget;
      if (thisElm === null || !(thisElm instanceof HTMLElement)) {
        reject();
        return;
      }
      const target: HTMLElement | null = document.querySelector(`#${thisElm.getAttribute('aria-controls')}`);
      if (target === null) {
        reject();
        return;
      }
      const flag = target.getAttribute('aria-hidden') !== 'false';
      thisElm.setAttribute('aria-expanded', `${flag}`);
      target.setAttribute('aria-hidden', `${!flag}`);
      if (flag) {
        target.setAttribute('tabindex', '0');
        new ScrollSwitch(true);
        setTimeout(() => {
          target.focus();
        }, 100);
      } else {
        target.removeAttribute('tabindex');
        new ScrollSwitch(false);
      }
      resolve();
    });
  }
}
