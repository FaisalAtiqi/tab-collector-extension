const STORAGE_KEY = "savedItems";

export function loadItems() {
  try {
    const storedItems = JSON.parse(localStorage.getItem(STORAGE_KEY));

    return Array.isArray(storedItems)
      ? storedItems
          .filter((item) => typeof item === "string" && item.trim() !== "")
          .map((item) => item.trim())
      : [];
  } catch (error) {
    return [];
  }
}

export function persistItems(savedItems) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
}

export function clearItems() {
  localStorage.removeItem(STORAGE_KEY);
}
