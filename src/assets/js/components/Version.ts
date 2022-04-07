import { browserName, detectOS } from "detect-browser";

/**
 * @class Version
 * @description デバイス情報を判定する処理
 */
export class Version {
  public isSP = false;
  private readonly ua = window.navigator.userAgent;
  private readonly browserName = browserName(this.ua);
  private readonly detectOS = detectOS(this.ua);
  private readonly bodyElm = document.body;

  constructor() {
    this.eventHandler();
  }

  private eventHandler(): void {
    this.onJudgeSP();
    this.handleAddClass();
  }

  /**
   * スマートフォンかどうか判別
   */
  private onJudgeSP(): void {
    switch (this.detectOS) {
      case 'Android OS':
      case 'iOS':
      case 'Windows Mobile':
      case 'BlackBerry OS': {
        this.isSP = true;
      }
    }
  }

  /**
   * bodyにclass追加
   */
  private handleAddClass(): void {
    switch (this.browserName) {
      case 'ie':
      case 'edge':
      case 'firefox': {
        this.bodyElm.classList.add(this.browserName);
        break;
      }
      case 'safari':
      case 'ios': {
        this.bodyElm.classList.add('safari');
        break;
      }
    }
    if (this.isSP) {
      this.bodyElm.classList.add('isSP');
    }
  }
}

export const UaIe = () => {
  const browser = window.navigator.userAgent.toLowerCase();
  const root = document.documentElement;

  // IEからアクセスされた場合はhtml要素に`class="ua-ie"`を付与する
  if (browser.indexOf('msie') > 0 || browser.indexOf('trident') > 0) {
    root.classList.add('ua-ie');
  }
};
