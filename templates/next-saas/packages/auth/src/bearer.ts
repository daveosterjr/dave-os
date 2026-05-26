export type BearerPrincipal = {
  organizationId: string;
  scopes: string[];
};

export async function validateBearerToken(token: string): Promise<BearerPrincipal | null> {
  // TODO: hash token and compare with ApiKey rows.
  if (!token) return null;
  return null;
}
