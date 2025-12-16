export const digitOnly = (value: string) => value.replace(/\D/g, "");

export const isValidDate = (value: string) => {
  const parts = value.split("/");
  if (parts.length !== 3) return false;
  const [day, month, year] = parts.map((v) => Number(v));
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export const birthdateToISO = (value: string) => {
  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
};

export const formatBirthdate = (value: string) => {
  const digits = digitOnly(value).slice(0, 8);
  const parts = [];
  if (digits.length >= 2) parts.push(digits.slice(0, 2));
  if (digits.length >= 4) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));
  return parts.join("/");
};

export const formatDateFromDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatCPF = (value: string) => {
  const digits = digitOnly(value).slice(0, 11);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 9);
  const part4 = digits.slice(9, 11);
  const formatted = [part1, part2, part3, part4].filter(Boolean);
  if (formatted.length === 0) return "";
  if (formatted.length === 1) return formatted[0]!;
  if (formatted.length === 2) return `${formatted[0]}.${formatted[1]}`;
  if (formatted.length === 3) return `${formatted[0]}.${formatted[1]}.${formatted[2]}`;
  return `${formatted[0]}.${formatted[1]}.${formatted[2]}-${formatted[3]}`;
};

export const formatPhone = (value: string) => {
  const digits = digitOnly(value).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};
