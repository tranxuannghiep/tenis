export const CATEGORIES = ['Equipment', 'Party', 'Contribution', 'Sponsorship', 'Other'];

export const formatVND = (val: string | number) => {
  if (val === undefined || val === null || val === '') return '';
  const num = typeof val === 'number' ? val.toString() : val.replace(/\D/g, '');
  if (!num) return '';
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseVND = (val: string) => {
  return val.replace(/\D/g, '');
};
