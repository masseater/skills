export type Outcome<T> = { ok: true; value: T } | { ok: false; error: unknown };

export async function firstOk<T>(tries: readonly (() => Promise<T>)[]): Promise<Outcome<T>> {
  let error: unknown = new Error("firstOk: nothing to try");
  for (const attempt of tries) {
    try {
      return { ok: true, value: await attempt() };
    } catch (caught) {
      error = caught;
    }
  }
  return { ok: false, error };
}
