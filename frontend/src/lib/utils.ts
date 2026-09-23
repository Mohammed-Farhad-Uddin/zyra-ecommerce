import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const taka = new Intl.NumberFormat('en-BD', {
  maximumFractionDigits: 0,
});

export function formatPrice(value: number) {
  return `৳${taka.format(Math.round(value))}`;
}

export function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const FALLBACK_IMAGE = '/images/placeholder.svg';
