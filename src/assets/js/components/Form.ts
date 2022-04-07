/**
 * @class Form
 * @description フォームをサブミットした時の処理
 */
export class Form {
  private readonly formElm = document.querySelectorAll('form');
  private readonly loaderElm = document.querySelector('.c-loading');

  constructor() {
    this.eventHandler().then();
  }

  /**
   * @name eventHandler
   */
  private async eventHandler(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (this.formElm.length === 0) {
        reject();
        return;
      }
      Array.prototype.map.call(this.formElm, (el: HTMLElement) => {
        el.addEventListener('submit', async () => await this.handleLoading().then());
      });
      this.handleLoadingCache().then();
      resolve();
    });
  }

  /**
   * @name loadingFunc
   */
  private async handleLoading(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (this.loaderElm === null) {
        reject();
        return;
      }
      this.loaderElm.remove();
      const divELm = document.createElement('div');
      const bodyElm = document.querySelector('body');
      if (bodyElm === null) return;
      divELm.className = 'c-loading';
      divELm.innerHTML = '<div class="c-loading__inner"><div></div></div>';
      bodyElm.appendChild(divELm);
      resolve();
    });
  }

  /**
   * @name loadingCache
   */
  private async handleLoadingCache(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      window.addEventListener('pageshow', (event) => {
        if (!event.persisted || this.loaderElm === null) {
          reject();
          return;
        }
        window.location.reload();
        resolve();
      });
    });
  }
}
