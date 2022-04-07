import { Version } from './Version';

/**
 * @class Tel
 * @description SP時に電話番号をアンカーにする処理
 */
export class Tel {
  private readonly isSP = new Version().isSP;
  private readonly selector01 = document.querySelectorAll('[data-sp-tel]');
  private readonly selector02 = document.querySelectorAll('[data-sp-tel-img]');

  constructor() {
    if (!this.isSP) return;
    this.eventHandler().then();
  }

  private async eventHandler(): Promise<void> {
    await this.handleSpTel().then();
    await this.handleLinkImg().then();
  }

  private async handleSpTel(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (this.selector01.length === 0) {
        reject();
        return;
      }
      Array.prototype.map.call(this.selector01, (element) => {
        const str: string = element.innerHTML;
        const tel: string | null = element.getAttribute('data-sp-tel-num')
          ? element.getAttribute('data-sp-tel-num')
          : element.textContent;
        const labelledby: string | null =
          element.getAttribute('data-sp-tel-labelledby') && element.getAttribute('data-sp-tel-labelledby');
        if (labelledby !== null) {
          element.outerHTML = `<a href="tel:${labelledby.replace(/-/g, '')}">${element.outerHTML}</a>`;
        } else if (tel !== null) {
          element.setAttribute('data-sp-tel', '');
          element.outerHTML = `<a href="tel:${tel.replace(/-/g, '')}">${str}</a>`;
        }
      });
      resolve();
    });
  }

  private async handleLinkImg(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (this.selector02.length === 0) {
        reject();
        return;
      }
      Array.prototype.map.call(this.selector02, (element) => {
        const alt: string | null = element.getAttribute('data-sp-tel-num')
          ? element.getAttribute('data-sp-tel-num')
          : element.getAttribute('alt');
        if (alt === null) {
          reject();
          return;
        }
        element.outerHTML = `<a href="tel:${alt.replace(/-/g, '')}">${element.outerHTML}</a>`;
      });
      resolve();
    });
  }
}
