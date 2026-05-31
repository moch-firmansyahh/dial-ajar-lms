export const formatNilai = (angka) => {
  if (angka === null || angka === undefined) return '-';
  if (angka >= 80) return 'A';
  if (angka >= 70) return 'B';
  if (angka >= 60) return 'C';
  if (angka >= 50) return 'D';
  return 'E';
};
