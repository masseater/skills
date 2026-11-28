import { cacheRootOf } from "@r_masseater/plugin-kit";
import { CACHE_SEGMENTS, ensureRuntime, takeLock } from "./lib/runtime.ts";

const root = await cacheRootOf(CACHE_SEGMENTS);
const release = takeLock(root);
if (release) {
  try {
    await ensureRuntime(root);
  } finally {
    release();
  }
}
