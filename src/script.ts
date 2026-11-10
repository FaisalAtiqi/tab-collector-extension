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

// Add a new item
function addItem(value: string) {
  const item = value.trim();
  if (!item) return false;

  if (savedItems.includes(item)) {
    alert("This item is already saved.");
    return false;
  }

  savedItems.push(item);
  persistItems(savedItems);
  renderItems(unorderedListElement, savedItems);
  return true;
}

// Handle manual input
function handleSaveInput() {
  if (!inputElement) {
    throw new Error("Input element not found");
  }
  const value = inputElement.value;

  if (!value.trim()) return;

  const addedItem = addItem(value);
  if (addedItem) inputElement.value = "";
}

// Delete all saved items
function deleteItems() {
  savedItems = [];
  clearItems();
  renderItems(unorderedListElement, savedItems);
}

// Delete single item
function deleteItem(listItem: HTMLLIElement) {
  const parentElement = listItem.parentElement;
  if (!parentElement) return;

  const index = Array.from(parentElement.children).indexOf(listItem);
  if (index === -1) return;

  savedItems.splice(index, 1);
  persistItems(savedItems);
  listItem.remove();
}

// Get the currently active edit input element, if any
function getActiveEditInput() {
  return document.querySelector<HTMLInputElement>(".li-input-on");
}

// Edit single item
function editItem(listItem: HTMLLIElement) {
  const activeEditInput = getActiveEditInput();

  if (activeEditInput) {
    cancelEdit();
  }

  const itemContentElement = listItem.firstElementChild;
  if (!itemContentElement) return;

  // Create an input element for editing
  const editInput = document.createElement("input");
  editInput.type = "text";
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
  deleteButton.textContent = "cancel";

  editButton.classList.replace("li-edit-btn", "li-save-btn");
  deleteButton.classList.replace("li-delete-btn", "li-cancel-btn");
}

// Restore the previously edited item.
function cancelEdit() {
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
function saveEdit() {
  const editInput = getActiveEditInput();
  if (!editInput) return;

  const newValue = editInput.value.trim();
  if (!newValue) return;

  const editingListItem = editInput.closest("li");
  if (!editingListItem) return;

  const parentElement = editingListItem.parentElement;
  if (!parentElement) return;

  const itemIndex = Array.from(parentElement.children).indexOf(editingListItem);
  if (itemIndex === -1) return;

  const originalValue = savedItems[itemIndex];

  if (newValue === originalValue) {
    return cancelEdit();
  }

  const duplicateItem = savedItems.some(
    (item, index) => index !== itemIndex && item === newValue,
  );

  if (duplicateItem) {
    alert("This item already exists.");
    editInput.focus();
    return;
  }

  savedItems[itemIndex] = newValue;

  persistItems(savedItems);
  renderItems(unorderedListElement, savedItems);
}

// Save the current Chrome tab
async function saveCurrentTab() {
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
      addItem(tab.url);
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
deleteBtn.addEventListener("dblclick", deleteItems);
tabBtn.addEventListener("click", saveCurrentTab);

ulElement.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest("button");

  if (!button || !ulElement.contains(button)) return;

  if (button.classList.contains("li-delete-btn")) {
    const li = button.closest("li");
    if (!li) return;
    return deleteItem(li);
  }

  if (button.classList.contains("li-edit-btn")) {
    const li = button.closest("li");
    if (!li) return;
    return editItem(li);
  }

  if (button.classList.contains("li-cancel-btn")) {
    return cancelEdit();
  }

  if (button.classList.contains("li-save-btn")) {
    return saveEdit();
  }
});

ulElement.addEventListener("keydown", (event) => {
  if (!(event.target instanceof Element)) return;
  if (!event.target.matches(".li-input-on")) return;

  if (event.key === "Enter") {
    return saveEdit();
  }

  if (event.key === "Escape") {
    return cancelEdit();
  }
});

// Initial render
renderItems(ulElement, savedItems);
