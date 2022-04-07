/**
 * @class Lib
 * @description myライブラリ
 */

/**
 * @name slideDown
 * @param element
 * @param duration
 */
export const slideDown = async (element: HTMLElement, duration = '200ms'): Promise<void> => {
  await new Promise<void>((resolve) => {
    try {
      element.style.height = '0';
      element.style.opacity = '0';
      element.style.display = 'block';
    } finally {
      element.style.transition = `all ${duration}`;
      element.style.height = `${element.scrollHeight}px`;
      element.style.opacity = '1';
      resolve();
    }
  });
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
  await new Promise<void>((resolve) => {
    element.addEventListener(
      'transitionend',
      () => {
        element.style.transition = 'none';
        element.style.height = 'auto';
        resolve();
      },
      { once: true }
    );
  });
};

/**
 * @name slideUp
 * @param element
 * @param duration
 */
export const slideUp = async (element: HTMLElement, duration = '200ms'): Promise<void> => {
  element.style.height = `${element.scrollHeight}px`;
  await new Promise<void>((resolve) => {
    element.style.transition = `all ${duration}`;
    element.style.height = '0';
    element.style.opacity = '0';
    resolve();
  });
  await new Promise<void>((resolve) => {
    element.addEventListener(
      'transitionend',
      () => {
        element.style.transition = 'none';
        element.style.display = 'none';
        resolve();
      },
      { once: true }
    );
  });
};

/**
 * @name slideToggle
 * @param element
 * @param duration
 * @param flag
 */
export const slideToggle = async (element: HTMLElement, duration = '200ms', flag = true): Promise<void> => {
  await new Promise<void>((resolve) => {
    flag ? slideDown(element, duration).then() : slideUp(element, duration).then();
    resolve();
  });
};

export const Lib = { slideUp, slideDown, slideToggle };
