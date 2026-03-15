export function getArrayFromResponse(response) {
  const payload = response?.data;

  if (payload?.success === true && Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}