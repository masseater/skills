import { ensureRuntime, runtimeRoot, takeLock } from "./lib/runtime.ts";

const root = runtimeRoot();
const release = takeLock(root);
if (release) {
  try {
    await ensureRuntime(root);
  } finally {
    release();
  }
}
