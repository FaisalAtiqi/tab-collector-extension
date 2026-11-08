export function createLiElementWithButtons(item) {
  const li = document.createElement("li");

  if (isValidUrl(item)) {
    const anchor = document.createElement("a");
    anchor.textContent = item;
    anchor.href = item;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";

    li.append(anchor);
  } else {
    const span = document.createElement("span");
    span.textContent = item;
    li.append(span);
  }

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "✕";
  deleteButton.className = "li-delete-btn";
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", "Delete item");

  const editButton = document.createElement("button");
  editButton.textContent = "🖉";
  editButton.className = "li-edit-btn";
  editButton.type = "button";
  editButton.setAttribute("aria-label", "Edit item");

  // Div wrapper for buttons to align them properly in css
  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "li-button-container";
  buttonsContainer.append(editButton);
  buttonsContainer.append(deleteButton);

  li.append(buttonsContainer);
  return li;
}

// Check if the item is a valid HTTP or HTTPS URL
function isValidUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

// Render saved items
export function renderItems(ulElement, savedItems) {
  ulElement.replaceChildren();

  const fragment = document.createDocumentFragment();

  for (const item of savedItems) {
    const li = createLiElementWithButtons(item);
    fragment.append(li);
  }

  ulElement.append(fragment);
}
