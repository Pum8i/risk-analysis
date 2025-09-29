import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parse } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses a custom date string into a Date object.
 * The input format is expected to be "d/MM/yyyy HH:mm:ss.S...S+ZZ",
 * where the fractional seconds part can have variable length.
 * It truncates fractional seconds to millisecond precision (3 digits) to work with `date-fns`.
 *
 * @param dateString The date string to parse.
 * @returns A valid Date object.
 * @throws Will throw an error if the date string cannot be parsed.
 */
export function parseWithDateFns(dateString: string): {
  date: Date;
  formattedDate: string;
} {
  const formatString = "d/MM/yyyy HH:mm:ss.SSSx";
  const dotIndex = dateString.lastIndexOf(".");
  const timeZoneIndex = dateString.lastIndexOf("+"); // or '-'
  const fractional = dateString.substring(dotIndex + 1, timeZoneIndex);
  const truncatedFractional = fractional.substring(0, 3);

  const truncatedString = `${dateString.substring(
    0,
    dotIndex + 1
  )}${truncatedFractional}${dateString.substring(timeZoneIndex)}`;

  const date = parse(truncatedString, formatString, new Date());

  // Check if the created date is valid
  if (isNaN(date.getTime())) {
    throw new Error(`Could not create a valid date from "${dateString}"`);
  }

  const formattedDate = date.toLocaleString("en-US", {
    hourCycle: "h23",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  });

  return { date, formattedDate };
}
