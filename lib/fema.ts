// Lightweight FEMA/OpenFEMA wrapper (placeholder)
// TODO: expand types, add caching, error handling, and pagination

export type FemaDeclaration = {
  declarationId: string;
  disasterNumber: string;
  incidentType: string;
  title: string;
  state: string;
  declarationDate: string;
};

/**
 * Fetch recent FEMA disaster declarations using OpenFEMA endpoint.
 * This is a minimal, resilient mapper to a small shape useful for UI placeholders.
 * TODO: add API key handling (if needed), local caching, and stricter typing.
 */
export async function fetchFemaDeclarations(opts?: { state?: string; limit?: number }): Promise<FemaDeclaration[]> {
  const base = 'https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries';
  const url = new URL(base);
  if (opts?.state) url.searchParams.set('state', String(opts.state));
  // OpenFEMA supports $top for limiting results; default to 10
  url.searchParams.set('$top', String(opts?.limit ?? 10));

  const res = await fetch(url.toString());
  if (!res.ok) {
    // Caller should handle failures; return empty array to keep UI stable
    return [];
  }

  const json = await res.json().catch(() => null);
  if (!json) return [];

  // The OpenFEMA payload places results under 'DisasterDeclarationsSummaries'
  const records = json?.DisasterDeclarationsSummaries ?? json?.data ?? [];

  return (records as any[]).map((r: any) => ({
    declarationId: String(r.declarationNumber ?? r.declarationId ?? ''),
    disasterNumber: String(r.disasterNumber ?? ''),
    incidentType: r.incidentType ?? r.designation ?? '',
    title: r.title ?? r.incidentType ?? '',
    state: r.state ?? r.stateCode ?? '',
    declarationDate: r.declarationDate ?? r.declaredCountyArea ?? '',
  }));
}

export default { fetchFemaDeclarations };
