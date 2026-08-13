export type CategoryColorTheme = {
  accent: string;
  themeBase: string;
  themeMid: string;
  themeLight: string;
  themeTextOnMid: string;
  themeTextOnLight: string;
};

export const CATEGORY_PRESET_COLORS = [
  "#ff7580",
  "#f99d3d",
  "#ffdd47",
  "#60d062",
  "#00cef5",
  "#bf73fd",
] as const;

export type CategoryPresetColor = (typeof CATEGORY_PRESET_COLORS)[number];

export const DEFAULT_CATEGORY_COLOR = CATEGORY_PRESET_COLORS[0];

export const normalizeHexColor = (color: string) => {
  const trimmedColor = color.trim();

  if (/^#[0-9a-fA-F]{6}$/.test(trimmedColor)) {
    return trimmedColor.toLowerCase();
  }

  if (/^#[0-9a-fA-F]{3}$/.test(trimmedColor)) {
    return `#${trimmedColor
      .slice(1)
      .split("")
      .map((value) => `${value}${value}`)
      .join("")}`.toLowerCase();
  }

  return "#171717";
};

const hexToRgb = (color: string) => {
  const normalizedColor = normalizeHexColor(color).slice(1);
  const value = Number.parseInt(normalizedColor, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `#${[r, g, b]
    .map((value) =>
      Math.round(Math.min(255, Math.max(0, value)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;

const mixWithWhite = (color: string, whiteRatio: number) => {
  const rgb = hexToRgb(color);

  return rgbToHex({
    r: rgb.r + (255 - rgb.r) * whiteRatio,
    g: rgb.g + (255 - rgb.g) * whiteRatio,
    b: rgb.b + (255 - rgb.b) * whiteRatio,
  });
};

const mixWithBlack = (color: string, blackRatio: number) => {
  const rgb = hexToRgb(color);

  return rgbToHex({
    r: rgb.r * (1 - blackRatio),
    g: rgb.g * (1 - blackRatio),
    b: rgb.b * (1 - blackRatio),
  });
};

const getRelativeLuminance = (color: string) => {
  const { r, g, b } = hexToRgb(color);
  const [red, green, blue] = [r, g, b].map((value) => {
    const channel = value / 255;

    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const getContrastRatio = (foreground: string, background: string) => {
  const foregroundLuminance = getRelativeLuminance(foreground);
  const backgroundLuminance = getRelativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

export const getReadableCategoryTextColor = (
  baseColor: string,
  backgroundColor: string,
) => {
  const normalizedBaseColor = normalizeHexColor(baseColor);
  const normalizedBackgroundColor = normalizeHexColor(backgroundColor);
  const shouldUseDarkText = getRelativeLuminance(normalizedBackgroundColor) >= 0.5;
  const mixColor = shouldUseDarkText ? mixWithBlack : mixWithWhite;
  const ratios = [0.42, 0.54, 0.66, 0.78, 0.9];

  for (const ratio of ratios) {
    const textColor = mixColor(normalizedBaseColor, ratio);

    if (getContrastRatio(textColor, normalizedBackgroundColor) >= 4.5) {
      return textColor;
    }
  }

  return shouldUseDarkText ? "#171717" : "#ffffff";
};

export const createCategoryColorTheme = (
  baseColor: string,
): CategoryColorTheme => {
  const normalizedBaseColor = normalizeHexColor(baseColor);
  const themeMid = mixWithWhite(normalizedBaseColor, 0.54);
  const themeLight = mixWithWhite(normalizedBaseColor, 0.86);

  return {
    accent: normalizedBaseColor,
    themeBase: normalizedBaseColor,
    themeMid,
    themeLight,
    themeTextOnMid: getReadableCategoryTextColor(normalizedBaseColor, themeMid),
    themeTextOnLight: getReadableCategoryTextColor(
      normalizedBaseColor,
      themeLight,
    ),
  };
};
