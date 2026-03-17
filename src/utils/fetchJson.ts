/**
 * Fetch a JSON config file from public/.
 * Tries the primary path first, falls back to the .example file if missing.
 * Vite dev server returns index.html (200) for missing paths due to SPA fallback,
 * so we check content-type to detect this.
 */
export async function fetchJson<T>(path: string, examplePath: string): Promise<T> {
  for (const url of [path, `/${examplePath}`]) {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') ?? '';
    if (res.ok && contentType.includes('application/json')) {
      return res.json();
    }
  }

  throw new Error(
    `配置文件 ${path} 不存在，请先复制示例文件：cp public/${examplePath} public/${path.slice(1)}`,
  );
}
