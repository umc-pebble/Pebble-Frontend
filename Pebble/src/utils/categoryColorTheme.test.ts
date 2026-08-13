import { describe, expect, it } from 'vitest';

import {
  createCategoryColorTheme,
  getReadableCategoryTextColor,
  normalizeHexColor,
} from './categoryColorTheme';

describe('categoryColorTheme', () => {
  it('3자리와 6자리 색상을 정규화한다', () => {
    expect(normalizeHexColor(' #0CF ')).toBe('#00ccff');
    expect(normalizeHexColor('#AABBCC')).toBe('#aabbcc');
  });

  it('유효하지 않은 색상은 기본 검정으로 대체한다', () => {
    expect(normalizeHexColor('transparent')).toBe('#171717');
  });

  it('기준색으로 중간색과 밝은색을 생성한다', () => {
    const theme = createCategoryColorTheme('#00cef5');

    expect(theme).toMatchObject({
      accent: '#00cef5',
      themeBase: '#00cef5',
      themeMid: '#8ae8fa',
      themeLight: '#dbf8fe',
    });
  });

  it('밝은 배경에는 어두운 계열의 텍스트를 선택한다', () => {
    expect(getReadableCategoryTextColor('#ffdd47', '#fff8da')).not.toBe(
      '#ffffff',
    );
  });
});
