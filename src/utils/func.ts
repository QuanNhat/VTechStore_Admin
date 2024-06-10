import { routes } from "./constant";

export function compactNumber(value: number): string {
  // Suffixes for different scales
  let precision: number = 0;
  const suffixes = ["", "K", "M", "B", "T", "P", "E"];
  // Determine the scale based on the absolute value
  const scale = !value ? 0 : Math.floor(Math.log10(Math.abs(value)) / 3);

  // Ensure scale is within the bounds of the suffixes array
  if (scale >= suffixes.length) {
    throw new Error("Number is too large to format");
  }

  // Calculate the formatted number
  const formattedNumber = (value / Math.pow(10, scale * 3)).toFixed(precision);
  // Append the appropriate suffix
  return `${formattedNumber}${suffixes[scale]}`;
}

export function formatNumberVND(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount);
}

export const formatDate = (date: Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2); // Adding 1 since getMonth() returns 0-indexed month
  const day = `0${d.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};

export const handleGetIndexPage = (params: string) => {
  switch (params) {
    case routes.home:
      return "1";
    case routes.product:
      return "2";
    case routes.category:
      return "3";
    case routes.report:
      return "4";
    default:
      return "1";
  }
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export function removeEndpoint(item: string): string {
  return item.replace(`${import.meta.env.VITE_API_ENDPOINT}/images/`, "");
}

export const formattedDate = (date: Date) => {
  return date.toISOString();
};

// format type dd/mm
export const formatDateDDMM = (date: Date) => {
  const d = new Date(date);
  const month = `0${d.getMonth() + 1}`.slice(-2); // Adding 1 since getMonth() returns 0-indexed month
  const day = `0${d.getDate()}`.slice(-2);
  return `${day}/${month}`;
};
