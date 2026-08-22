export function getApiErrorMessage(
  error,
  fallbackMessage = "Something went wrong.",
) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const validationMessages = detail.map((item) => item?.msg).filter(Boolean);

    if (validationMessages.length > 0) {
      return validationMessages.join(", ");
    }
  }

  return error?.message || fallbackMessage;
}
