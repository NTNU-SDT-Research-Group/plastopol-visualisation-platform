import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TS_ORIGIN = new Date("2010-01-01").getTime();

type ResponseData = {
  start_date: string;
  end_date: string;
  total: string;
  personal_use: string;
  fisheries: string;
  industrial: string;
  hygiene: string;
  others: string;
  lon: number;
  lat: number;
};

export type PostProcessedData = {
  start_date: number;
  end_date: number;
  total: number;
  personal_use: number;
  fisheries: number;
  industrial: number;
  hygiene: number;
  others: number;
  longitude: number;
  latitude: number;
};

export function getTimeRange(
  data: PostProcessedData[]
): [number, number] | null {
  if (!data || data.length === 0) {
    return null;
  }

  return data.reduce(
    (range, d) => {
      range[0] = Math.min(range[0], d.start_date);
      range[1] = Math.max(range[1], d.end_date);
      return range;
    },
    [Infinity, -Infinity]
  );
}

export function postProcess(data: ResponseData[]): PostProcessedData[] {
  return data.map((d) => ({
    start_date: new Date(d.start_date).getTime(),
    end_date: new Date(d.end_date).getTime(),
    total: parseFloat(d.total),
    personal_use: parseFloat(d.personal_use),
    fisheries: parseFloat(d.fisheries),
    industrial: parseFloat(d.industrial),
    hygiene: parseFloat(d.hygiene),
    others: parseFloat(d.others),
    longitude: d.lon,
    latitude: d.lat,
  }));
}

export function formatDate(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
