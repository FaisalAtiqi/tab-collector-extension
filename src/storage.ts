const STORAGE_KEY = "savedItems";

export function loadItems(): string[] {
  try {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    if (!storedItems) return [];

    const storedItemsParsed: unknown = JSON.parse(storedItems);

    return Array.isArray(storedItemsParsed)
      ? storedItemsParsed
          .filter(
            (item): item is string =>
              typeof item === "string" && item.trim() !== "",
          )
          .map((item) => item.trim())
      : [];
  } catch (error) {
    return [];
  }
}

export function persistItems(savedItems: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
}

export function clearItems() {
  localStorage.removeItem(STORAGE_KEY);
}
