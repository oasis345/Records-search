import { atom } from 'recoil';

const globalSettings = atom({
  key: 'globalSettings',
  default: {
    theme: 'white',
    language: 'ko',
  },
});

export default globalSettings;
