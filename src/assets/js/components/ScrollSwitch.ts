/**
 * @class ScrollSwitch
 * @description スクロールできなくしたりできるようにする処理
 * @param mode trueでscrollを停止し、falseでscrollを停止を解除する
 */
export class ScrollSwitch {
  private readonly bodyElm = document.querySelector('body');
  private readonly scrollPos: number;
  constructor(mode: boolean) {
    this.scrollPos = mode
      ? window.pageYOffset
      : this.bodyElm !== null
      ? Number(`${this.bodyElm.getAttribute('data-scroll')}`)
      : 0;
    this.eventHandler(this.bodyElm, mode, this.scrollPos).then();
  }
  private async eventHandler(element, mode, pos): Promise<void> {
    await new Promise<void>((resolve) => {
      element.classList.toggle('noScroll', mode);
      element.style.top = mode ? `-${pos}px` : '';
      if (mode) {
        element.setAttribute('data-scroll', `${pos}`);
      } else {
        element.removeAttribute('data-scroll');
        window.scrollTo(0, pos);
      }
      resolve();
    });
  }
}
