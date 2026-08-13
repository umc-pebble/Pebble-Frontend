const SEOUL_TIME_ZONE = 'Asia/Seoul';
const VISIBLE_ACTIVITY_DAYS = 7;

function formatDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: SEOUL_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';
  const day = parts.find((part) => part.type === 'day')?.value ?? '';

  return `${year}-${month}-${day}`;
}

export function getSeoulBaseDate(date = new Date()) {
  return formatDateParts(date);
}

function parseDateString(date: string) {
  const [year, month, day] = date.split('-').map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}

function formatUtcDate(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getRecentSevenDates(baseDate: string) {
  const base = parseDateString(baseDate);

  return Array.from({ length: VISIBLE_ACTIVITY_DAYS }, (_, index) => {
    const date = new Date(base);
    date.setUTCDate(base.getUTCDate() - (VISIBLE_ACTIVITY_DAYS - 1 - index));

    return formatUtcDate(date);
  });
}