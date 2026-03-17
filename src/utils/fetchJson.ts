/**
 * Fetch a JSON file from public/, with clear error when the file is missing.
 * Vite dev server returns index.html (200) for missing paths due to SPA fallback,
 * so we check content-type to detect this.
 */
export async function fetchJson<T>(path: string, examplePath: string): Promise<T> {
  const res = await fetch(path);

  const contentType = res.headers.get('content-type') ?? '';
  if (!res.ok || !contentType.includes('application/json')) {
    throw new Error(
      `配置文件 ${path} 不存在，请先复制示例文件：cp public/${examplePath} public/${path.slice(1)}`,
    );
  }

  return res.json();
}
