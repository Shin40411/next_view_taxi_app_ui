import { format, getTime, formatDistanceToNow, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';


// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date && isValid(new Date(date)) ? format(new Date(date), fm, { locale: vi }) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date && isValid(new Date(date)) ? format(new Date(date), fm, { locale: vi }) : '';
}

export function fTimestamp(date: InputValue) {
  return date && isValid(new Date(date)) ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date && isValid(new Date(date))
    ? formatDistanceToNow(new Date(date), {
      addSuffix: false,
      locale: vi,
    })
    : '';
}
