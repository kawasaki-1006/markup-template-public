import { CONFIG } from '../foundation/Config';
import { slideDown, slideUp } from '../library';

/**
 * @class HoverNav
 * @description マウスオーバーメニューのキーボード操作用
 */
export class HoverNav {
  private readonly parentSelector = document.querySelectorAll('[data-hovernav]');
  private readonly selector = document.querySelectorAll('[data-hovernav-panel]');

  constructor() {
    this.eventHandler().then();
  }

  private async eventHandler(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (this.parentSelector.length === 0) {
        reject();
        return;
      }
      Array.prototype.map.call(this.parentSelector, (el: HTMLElement) => {
        const $toggle: HTMLElement | null = el.querySelector('[data-hovernav-toggle]');
        if (window.innerWidth > CONFIG.tbL) {
          el.addEventListener('mouseover', async (ev: MouseEvent) => await this.onChange(ev));
          el.addEventListener('mouseleave', async (ev: MouseEvent) => await this.onChange(ev));
          el.addEventListener('focusin', async (ev: FocusEvent) => await this.onChange(ev));
          el.addEventListener('focusout', async (ev: FocusEvent) => await this.onChange(ev));
        }
        if ($toggle === null) {
          reject();
          return;
        }
        $toggle.addEventListener('click', async (ev: MouseEvent) => await this.onClick(ev));
      });
      resolve();
    });
    await new Promise<void>((resolve, reject) => {
      if (this.selector.length === 0) {
        reject();
        return;
      }
      Array.prototype.map.call(this.selector, (el: HTMLElement) => {
        if (window.innerWidth <= CONFIG.tbL) {
          reject();
          return;
        }
        this.onLoad(el).then();
        window.addEventListener('resize', async () => await this.onLoad(el));
        el.addEventListener('focusin', async (ev: FocusEvent) => await this.onChange(ev));
        el.addEventListener('focusout', async (ev: FocusEvent) => await this.onChange(ev));
      });
      resolve();
    });
  }

  private async onLoad(el: HTMLElement): Promise<void> {
    await el.setAttribute('tabindex', window.innerWidth > CONFIG.tbL ? '0' : '-1');
  }

  private async onChange(ev: MouseEvent | FocusEvent): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (window.innerWidth <= CONFIG.tbL) {
        reject();
        return;
      }
      const $this: EventTarget | null = ev.currentTarget;
      if (!($this instanceof HTMLElement)) {
        reject();
        return;
      }

      if (ev instanceof MouseEvent) {
        const $parent = $this.parentElement;
        if ($parent === null) {
          reject();
          return;
        }
        const $toggle: HTMLElement | null = $parent.querySelector('[data-hovernav-toggle]');
        const $panel: HTMLElement | null = $this.getAttribute('data-hovernav')
          ? $parent.querySelector('[data-hovernav-toggle]')
          : $this;
        if (!$toggle || !$panel) {
          reject();
          return;
        }
        switch (ev.type) {
          case 'focusin':
            this.handleChild($toggle, $panel, true);
            this.onFocus($panel, true);
            break;
          case 'focusout':
            this.handleChild($toggle, $panel, false);
            this.onFocus($panel, false);
            break;
        }
      }

      if (ev instanceof FocusEvent) {
        const $toggle: HTMLElement | null = $this.querySelector('[data-hovernav-toggle]');
        const $panel: HTMLElement | null = $this.querySelector('[data-hovernav-panel]');
        if (!$toggle || !$panel) {
          reject();
          return;
        }
        switch (ev.type) {
          case 'mouseover':
            this.handleChild($toggle, $panel, true);
            this.onFocus($panel, true);
            break;
          case 'mouseleave':
            this.handleChild($toggle, $panel, false);
            this.onFocus($panel, false);
            break;
        }
      }

      resolve();
    });
  }
  private async onFocus(el: HTMLElement, flag: boolean): Promise<void> {
    await new Promise<void>((resolve) => {
      el.classList.toggle('-focus', flag);
      el.setAttribute('aria-hidden', `${!flag}`);
      el.setAttribute('tabindex', `${flag ? 0 : -1}`);
      resolve();
    });
  }

  private async handleChild(toggle: HTMLElement, panel: HTMLElement, flag): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (toggle === null || panel === null) {
        reject();
        return;
      }
      toggle.setAttribute('aria-expanded', `${flag}`);
      panel.setAttribute('aria-hidden', `${!flag}`);
      resolve();
    });
  }
  private async onClick(ev: Event): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      ev.preventDefault();
      const $this = ev.currentTarget;
      if ($this === null || !($this instanceof HTMLElement)) {
        reject();
        return;
      }
      const flag = $this.getAttribute('aria-expanded') == 'true';
      const $target = document.querySelector(`[data-hovernav-panel]#${$this.getAttribute('aria-controls')}`);
      if ($target === null) {
        reject();
        return;
      }
      $this.setAttribute('aria-expanded', `${!flag}`);
      $target.setAttribute('aria-hidden', `${flag}`);
      if (!flag) {
        slideDown(<HTMLElement>$target).then();
      } else {
        slideUp(<HTMLElement>$target).then();
      }
      resolve();
    });
  }
}
