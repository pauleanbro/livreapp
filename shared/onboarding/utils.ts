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
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));
  return parts.join("/");
};

export const formatDateFromDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const parseDateFromDDMMYYYY = (value: string) => {
  if (!isValidDate(value)) return null;
  const [day, month, year] = value.split("/").map((v) => Number(v));
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

export const isBirthdateWithinRange = (
  value: string,
  { minAge = 18, maxAge = 100, referenceDate = new Date() } = {},
) => {
  const date = parseDateFromDDMMYYYY(value);
  if (!date) return false;

  let age = referenceDate.getFullYear() - date.getFullYear();
  const birthdayThisYear = new Date(
    referenceDate.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  if (referenceDate < birthdayThisYear) {
    age -= 1;
  }

  return age >= minAge && age <= maxAge;
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

export const isValidCPF = (value: string) => {
  const digits = digitOnly(value);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const numbers = digits.split("").map(Number);
  const calcCheck = (length: number) => {
    let sum = 0;
    for (let i = 0; i < length; i += 1) {
      sum += numbers[i] * (length + 1 - i);
    }
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  const firstCheck = calcCheck(9);
  const secondCheck = calcCheck(10);
  return numbers[9] === firstCheck && numbers[10] === secondCheck;
};

export const formatCNPJ = (value: string) => {
  const digits = digitOnly(value).slice(0, 14);
  if (!digits) return "";
  const part1 = digits.slice(0, 2);
  const part2 = digits.slice(2, 5);
  const part3 = digits.slice(5, 8);
  const part4 = digits.slice(8, 12);
  const part5 = digits.slice(12, 14);

  let formatted = part1;
  if (part2) {
    formatted += `.${part2}`;
  }
  if (part3) {
    formatted += `.${part3}`;
  }
  if (part4) {
    formatted += `/${part4}`;
  }
  if (part5) {
    formatted += `-${part5}`;
  }

  return formatted;
};

export const isValidCNPJ = (value: string) => {
  const digits = digitOnly(value);
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const numbers = digits.split("").map(Number);
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const calcCheck = (weights: number[]) => {
    const sum = weights.reduce((acc, weight, idx) => acc + numbers[idx] * weight, 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const firstCheck = calcCheck(weights1);
  const secondCheck = calcCheck(weights2);
  return numbers[12] === firstCheck && numbers[13] === secondCheck;
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
