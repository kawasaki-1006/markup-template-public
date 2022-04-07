import { load } from 'webfontloader';

const setFonts = ['Noto+Sans+JP:400,500,700'];

load({
  google: {
    families: setFonts,
  },
  active: () => {
    sessionStorage.fonts = true;
  },
});
