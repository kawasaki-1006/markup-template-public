/**
 * @class Link
 * @description アンカーをクリックした時の処理
 */

export class Link {
  private readonly fixedShift = 0;

  constructor() {
    this.eventHandler().then();
  }

  private async eventHandler(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      const linkElm: NodeListOf<HTMLElement> = document.querySelectorAll('[href^="#"]');
      if (linkElm.length === 0) {
        reject();
        return;
      }
      Array.prototype.map.call(linkElm, (element: HTMLElement) => {
        element.addEventListener('click', async (event: Event) => {
          await this.handleClickScroll(event);
          resolve();
        });
      });
    });
    await new Promise<void>((resolve) => {
      window.addEventListener('DOMContentLoaded', async () => {
        await this.handleLoadScroll();
        resolve();
      });
    });
    await new Promise<void>((resolve) => {
      window.addEventListener('hashchange', async () => {
        await this.handleLoadScroll();
        resolve();
      });
    });
    await new Promise<void>((resolve) => {
      window.addEventListener('load', async () => {
        await this.handleLoadScroll();
        resolve();
      });
    });
  }

  private async handleClickScroll(event): Promise<void> {
    event.preventDefault();
    await new Promise<void>((resolve, reject) => {
      const target: EventTarget | null = event.currentTarget;
      if (target === null || !(target instanceof HTMLElement) || !(target instanceof HTMLAnchorElement)) {
        reject();
        return;
      }
      const targetId: string | null = target.hash;
      if (targetId === null) {
        reject();
        return;
      }
      const anchorTarget: HTMLElement | null = document.querySelector(targetId);
      if (anchorTarget === null) {
        reject();
        return;
      }
      const anchorTargetRect = anchorTarget.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const anchorTargetOffsetTop = anchorTargetRect.top + scrollTop;

      const topOfElement = anchorTargetOffsetTop - this.fixedShift;
      window.scroll({
        top: topOfElement,
        behavior: 'smooth',
      });
      window.scroll({
        top: topOfElement,
        behavior: 'smooth',
      });
      resolve();
    });
  }

  private async handleLoadScroll(): Promise<void> {
    const hash: string | null = location.hash;
    if (hash === null) return;
    const target: HTMLElement | null = document.querySelector(`${hash}`);
    if (target === null) return;
    const targetOffset = target.offsetTop;
    const scrollPos = targetOffset - this.fixedShift;
    window.scroll({
      top: scrollPos,
      behavior: 'smooth',
    });
  }
}
