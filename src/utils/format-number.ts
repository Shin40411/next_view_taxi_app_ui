import numeral from 'numeral';

// ----------------------------------------------------------------------

type InputValue = string | number | null;

export function fNumber(number: InputValue) {
  return numeral(number).format();
}

export function fCurrency(number: InputValue) {
  if (!number) return '';

  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(number));
}

export function fPoint(number: InputValue) {
  if (!number) return '0 GoXu';

  const formatted = new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(Number(number));
  return `${formatted} GoXu`;
}

export function fPercent(number: InputValue) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number: InputValue) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number: InputValue) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format: string, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}

export function convertGoxuToVnd(number: InputValue) {
  if (!number) return 0;
  return Number(number) * 1000;
}
