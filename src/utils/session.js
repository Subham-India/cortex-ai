const SESSION_DAYS = 7;

export async function isSessionExpired(firebaseUser) {
  const { authTime } = await firebaseUser.getIdTokenResult();
  const ageMs = Date.now() - new Date(authTime).getTime();
  return ageMs > SESSION_DAYS * 24 * 60 * 60 * 1000;
}