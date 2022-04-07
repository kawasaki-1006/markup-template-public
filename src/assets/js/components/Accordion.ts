import { CONFIG } from '../foundation/Config';
import { slideToggle } from '../library';

/**
 * @class Accordion
 * @description アコーディオンの処理
 * @param toggle
 * @param panel
 * @param option
 */
export class Accordion {
  public toggleElm: string;
  public panelElm: string;
  public option: {
    mode: string;
  };

  constructor(toggle = '[data-accordion-toggle]', panel = '[data-accordion-panel]', option = { mode: 'normal' }) {
    this.toggleElm = toggle;
    this.panelElm = panel;
    this.option = option;
    this.eventHandler().then();
  }

  /**
   * @name eventHandler
   */
  private async eventHandler(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      const toggleArray: NodeListOf<HTMLElement> = document.querySelectorAll(this.toggleElm);
      if (toggleArray.length === 0) {
        reject();
        return;
      }
      Array.prototype.map.call(toggleArray, (element: HTMLElement) => {
        element.addEventListener('click', async (event: MouseEvent) => {
          if (this.option.mode === 'spOnly' && window.innerWidth < CONFIG.tbL) {
            await this.onClick(event).then();
          } else {
            await this.onClick(event).then();
          }
          resolve();
        });
      });
    });
  }

  /**
   * @name clickEvents
   * @param event
   */
  private async onClick(event: MouseEvent): Promise<void> {
    event.preventDefault();
    await new Promise<void>((resolve, reject) => {
      const thisElm: EventTarget | null = event.currentTarget as HTMLElement;
      if (thisElm === null || !(thisElm instanceof HTMLElement)) {
        reject();
        return;
      }
      const targetELm: HTMLElement | null = document.querySelector(
        `${this.panelElm}#${thisElm.getAttribute('aria-controls')}`
      );
      if (targetELm === null) {
        reject();
        return;
      }
      const isHidden = targetELm.getAttribute('aria-hidden') === 'true';
      slideToggle(targetELm, '200ms', isHidden).then(() => {
        thisElm.setAttribute('aria-expanded', `${isHidden}`);
        targetELm.setAttribute('aria-hidden', `${!isHidden}`);
        if (isHidden) {
          targetELm.removeAttribute('tabindex');
        } else {
          targetELm.setAttribute('tabindex', '-1');
        }
      });
      resolve();
    });
  }
}
