/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#D4A27F';
const tintColorDark = '#E8B899';

export const Colors = {
  light: {
    text: '#2D2D2A',
    background: '#FAF9F7',
    tint: tintColorLight,
    icon: '#8C8985',
    tabIconDefault: '#8C8985',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#EDE9E3',
    background: '#1A1917',
    tint: tintColorDark,
    icon: '#9B9590',
    tabIconDefault: '#9B9590',
    tabIconSelected: tintColorDark,
  },
};
