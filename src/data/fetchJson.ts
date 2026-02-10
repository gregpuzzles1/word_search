export type Validator = (data: unknown) => string[];

export async function fetchJson<T>(url: string, validate?: Validator): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as unknown;
  if (validate) {
    const errors = validate(data);
    if (errors.length) {
      throw new Error(`Invalid data from ${url}: ${errors.join("; ")}`);
    }
  }

  return data as T;
}
