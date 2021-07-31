import { URLSearchParams } from "url";

export const wait = async (ms: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  });
};

export const plusSeconds = (date: Date, seconds: number): Date => {
  const newDate = new Date();
  newDate.setTime(date.getTime() + seconds * 1000);
  return newDate;
};

/**
 * Construct URL search params and convert them to string
 * @param params params to add
 */
export const searchParamsString = (params: Record<string, string>): string => {
  const urlSearchParams = new URLSearchParams();

  for (const key in params) {
    urlSearchParams.append(key, params[key]);
  }

  return urlSearchParams.toString();
};

export const createUrlWithParams = (url: string, params: Record<string, string>): string => {
  return `${url}?${searchParamsString(params)}`;
};
