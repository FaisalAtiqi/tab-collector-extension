type AddItemResult =
  | { status: "success"; items: string[] }
  | { status: "empty" }
  | { status: "duplicate" };

export function addItem(items: string[], item: string): AddItemResult {
  const newItem = item.trim();
  if (!newItem) return { status: "empty" };

  const isDuplicate = items.includes(newItem);
  if (isDuplicate) return { status: "duplicate" };

  const updatedItems = [...items, newItem];
  return {
    status: "success",
    items: updatedItems,
  };
}

type UpdateItemResult =
  | { status: "success"; items: string[] }
  | { status: "empty" }
  | { status: "duplicate" }
  | { status: "unchanged" }
  | { status: "invalid-index" };

export function updateItem(
  items: string[],
  newItem: string,
  index: number,
): UpdateItemResult {
  const newValue = newItem.trim();
  if (!newValue) return { status: "empty" };

  const validIndex = index >= 0 && index < items.length;
  if (!validIndex) return { status: "invalid-index" };

  const isDuplicate = items.some((v, i) => i !== index && v === newValue);
  if (isDuplicate) return { status: "duplicate" };

  const originalItem = items[index];
  if (originalItem === newValue) return { status: "unchanged" };

  const updatedItems = items.map((v, i) => (i === index ? newValue : v));

  return { status: "success", items: updatedItems };
}

type DeleteItemResult =
  | { status: "success"; items: string[] }
  | { status: "invalid-index" };

export function deleteItem(items: string[], index: number): DeleteItemResult {
  const validIndex =
    Number.isInteger(index) && index >= 0 && index < items.length;

  if (!validIndex) return { status: "invalid-index" };

  const updatedItems = items.filter((_, i) => i !== index);
  return { status: "success", items: updatedItems };
}
