import { list } from 'country-flag-emoji';

type CountryFlagItem = {
  code: string;
  unicode: string;
  name: string;
  emoji: string;
};

export function colorFor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const hue = Math.abs(h) % 360;

  const color1 = `oklch(75% 0.16 ${hue})`;
  const color2 = `oklch(55% 0.12 ${hue})`;

  return {
    color1,
    color2,
    id: `gradient-${name.replace(/\s+/g, '-').toLowerCase()}`,
  };
}

export function getCountryFlag(countryName: string): string {
  const flagList = list as CountryFlagItem[];

  let found = flagList.find(
    (item: CountryFlagItem) => item.name === countryName,
  );

  if (!found) {
    found = flagList.find(
      (item: CountryFlagItem) =>
        item.name.toLowerCase() === countryName.toLowerCase(),
    );
  }

  if (!found) {
    found = flagList.find(
      (item: CountryFlagItem) =>
        item.name.toLowerCase().includes(countryName.toLowerCase()) ||
        countryName.toLowerCase().includes(item.name.toLowerCase()),
    );
  }

  if (!found) {
    const variations = [
      countryName.replace(/^The\s+/i, ''),
      countryName.replace('United States', 'United States of America'),
      countryName.replace('Russia', 'Russian Federation'),
      countryName.replace('Vietnam', 'Viet Nam'),
    ];

    for (const variation of variations) {
      found = flagList.find(
        (item: CountryFlagItem) =>
          item.name.toLowerCase() === variation.toLowerCase(),
      );
      if (found) break;
    }
  }

  return found ? found.emoji : '🌍';
}
