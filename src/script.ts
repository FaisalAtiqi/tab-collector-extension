import { addItem, deleteItem, updateItem } from "./items.js";
import { clearItems, loadItems, persistItems } from "./storage.js";
import { createLiElementWithButtons, renderItems } from "./ui.js";

const inputElement = document.querySelector<HTMLInputElement>("#input-element");
const saveBtn = document.querySelector<HTMLButtonElement>("#save-btn");
const deleteBtn = document.querySelector<HTMLButtonElement>("#delete-btn");
const tabBtn = document.querySelector<HTMLButtonElement>("#tab-btn");
const ulElement = document.querySelector<HTMLUListElement>("#ul-element");

// Check that the elements exist
if (!inputElement || !saveBtn || !deleteBtn || !ulElement || !tabBtn) {
  throw new Error("Required DOM elements not found");
}

let savedItems = loadItems();

// Preserve the non-null type for use inside function closures
const unorderedListElement = ulElement;

function saveItem(item: string): boolean {
  const result = addItem(savedItems, item);

  if (result.status === "empty") return false;
  if (result.status === "duplicate") {
    alert("This item is already saved.");
    return false;
  }

  savedItems = result.items;
  persistItems(savedItems);
  renderItems(unorderedListElement, savedItems);
  return true;
}
// Handle manual input
function handleSaveInput() {
  if (!inputElement) {
    throw new Error("Input element not found");
  }
  const item = inputElement.value;
  if (saveItem(item)) {
    inputElement.value = "";
  }
}

// Delete all saved items
function handleDeleteItems() {
  savedItems = [];
  clearItems();
  renderItems(unorderedListElement, savedItems);
}

// Delete single item
function handleDeleteItem(listItem: HTMLLIElement) {
  const parentElement = listItem.parentElement;
  if (!parentElement) return;

  const index = Array.from(parentElement.children).indexOf(listItem);
  if (index === -1) return;

  const result = deleteItem(savedItems, index);
  if (result.status === "invalid-index") return;

  savedItems = result.items;
  persistItems(savedItems);
  renderItems(unorderedListElement, savedItems);
}

// Get the currently active edit input element, if any
function getActiveEditInput() {
  return document.querySelector<HTMLInputElement>(".li-input-on");
}

// Edit single item
function handleEditItem(listItem: HTMLLIElement) {
  const activeEditInput = getActiveEditInput();

  if (activeEditInput) {
    handleCancelEdit();
  }

  const itemContentElement = listItem.firstElementChild;
  if (!itemContentElement) return;

  // Create an input element for editing
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.name = "edit-item";
  editInput.setAttribute("aria-label", "Edit saved item");
  editInput.value = itemContentElement.textContent;
  editInput.className = "li-input-on";

  // Change the buttons to SAVE and CANCEL
  const buttonsContainer = listItem.querySelector<HTMLDivElement>(
    ".li-button-container",
  );
  if (!buttonsContainer) return;

  const editButton =
    buttonsContainer.querySelector<HTMLButtonElement>(".li-edit-btn");
  const deleteButton =
    buttonsContainer.querySelector<HTMLButtonElement>(".li-delete-btn");

  if (!editButton || !deleteButton) return;

  // Replace the element with the input element
  itemContentElement.replaceWith(editInput);
  editInput.focus();

  editButton.textContent = "save";
  editButton.setAttribute("aria-label", "Save changes");

  deleteButton.textContent = "cancel";
  deleteButton.setAttribute("aria-label", "Cancel editing");

  editButton.classList.replace("li-edit-btn", "li-save-btn");
  deleteButton.classList.replace("li-delete-btn", "li-cancel-btn");
}

// Restore the previously edited item.
function handleCancelEdit() {
  const editInput = getActiveEditInput();
  if (!editInput) return;

  const editingListItem = editInput.closest("li");
  if (!editingListItem) return;

  const parentElement = editingListItem.parentElement;
  if (!parentElement) return;

  const itemIndex = Array.from(parentElement.children).indexOf(editingListItem);
  if (itemIndex === -1) return;

  const originalItem = savedItems[itemIndex];
  if (originalItem === undefined) return;

  const listItem = createLiElementWithButtons(originalItem);
  editingListItem.replaceWith(listItem);
}

// Save the edited item
function handleSaveEdit() {
  const editInput = getActiveEditInput();
  if (!editInput) return;

  const editingListItem = editInput.closest("li");
  if (!editingListItem) return;

  const parentElement = editingListItem.parentElement;
  if (!parentElement) return;

  const itemIndex = Array.from(parentElement.children).indexOf(editingListItem);
  if (itemIndex === -1) return;

  const newItem = editInput.value;
  const result = updateItem(savedItems, newItem, itemIndex);

  if (result.status === "empty") return;
  if (result.status === "invalid-index") return;

  if (result.status === "unchanged") {
    return handleCancelEdit();
  }

  if (result.status === "duplicate") {
    alert("This item already exists.");
    editInput.focus();
    return;
  }

  savedItems = result.items;
  persistItems(savedItems);
  renderItems(unorderedListElement, savedItems);
}

// Save the current Chrome tab
async function handleSaveCurrentTab() {
  try {
    const queryOptions = { active: true, currentWindow: true };

    if (!chrome?.tabs) {
      console.warn(
        "This feature is only available inside the browser extension.",
      );
      return;
    }

    const [tab] = await chrome.tabs.query(queryOptions);

    if (tab?.url) {
      saveItem(tab.url);
    } else {
      alert("Unable to access this tab's URL.");
    }
  } catch (error) {
    console.error("Failed to save current tab:", error);
    alert("Something went wrong while accessing the tab.");
  }
}

// Event listeners
inputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSaveInput();
  }
});

saveBtn.addEventListener("click", handleSaveInput);
deleteBtn.addEventListener("dblclick", handleDeleteItems);
tabBtn.addEventListener("click", handleSaveCurrentTab);

ulElement.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest("button");

  if (!button || !ulElement.contains(button)) return;

  if (button.classList.contains("li-delete-btn")) {
    const li = button.closest("li");
    if (!li) return;
    return handleDeleteItem(li);
  }

  if (button.classList.contains("li-edit-btn")) {
    const li = button.closest("li");
    if (!li) return;
    return handleEditItem(li);
  }

  if (button.classList.contains("li-cancel-btn")) {
    return handleCancelEdit();
  }

  if (button.classList.contains("li-save-btn")) {
    return handleSaveEdit();
  }
});

ulElement.addEventListener("keydown", (event) => {
  if (!(event.target instanceof Element)) return;
  if (!event.target.matches(".li-input-on")) return;

  if (event.key === "Enter") {
    return handleSaveEdit();
  }

  if (event.key === "Escape") {
    return handleCancelEdit();
  }
});

// Initial render
renderItems(ulElement, savedItems);
