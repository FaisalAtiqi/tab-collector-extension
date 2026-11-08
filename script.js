import { clearItems, loadItems, persistItems } from "./storage.js";
import { createLiElementWithButtons, renderItems } from "./ui.js";

const inputElement = document.getElementById("input-element");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");
const ulElement = document.getElementById("ul-element");
const tabBtn = document.getElementById("tab-btn");

let savedItems = loadItems();

// Add a new item
function addItem(value) {
  const item = value?.trim();
  if (!item) return false;

  if (savedItems.includes(item)) {
    alert("This item is already saved.");
    return false;
  }

  savedItems.push(item);
  persistItems(savedItems);
  renderItems(ulElement, savedItems);
  return true;
}

// Handle manual input
function handleSaveInput() {
  const value = inputElement.value;

  if (!value.trim()) return;

  const addedItem = addItem(value);
  if (addedItem) inputElement.value = "";
}

// Delete all saved items
function deleteItems() {
  savedItems = [];
  clearItems();
  renderItems(ulElement, savedItems);
}

// Delete single item
function deleteItem(listItem) {
  const index = Array.from(listItem.parentElement.children).indexOf(listItem);
  if (index === -1) return;

  savedItems.splice(index, 1);
  persistItems(savedItems);
  listItem.remove();
}

// Get the currently active edit input element, if any
function getActiveEditInput() {
  return document.querySelector(".li-input-on");
}

// Edit single item
function editItem(listItem) {
  const activeEditInput = getActiveEditInput();

  if (activeEditInput) {
    cancelEdit();
  }

  const itemContentElement = listItem.firstElementChild;

  // Create an input element for editing
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = itemContentElement.textContent;
  editInput.className = "li-input-on";

  // Replace the element with the input element
  itemContentElement.replaceWith(editInput);
  editInput.focus();

  // Change the buttons to SAVE and CANCEL
  const buttonsContainer = listItem.querySelector(".li-button-container");

  const editButton = buttonsContainer.querySelector(".li-edit-btn");
  const deleteButton = buttonsContainer.querySelector(".li-delete-btn");

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

  const itemIndex = Array.from(editingListItem.parentElement.children).indexOf(
    editingListItem,
  );
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

  const itemIndex = Array.from(editingListItem.parentElement.children).indexOf(
    editingListItem,
  );
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
  renderItems(ulElement, savedItems);
}

// Save the current Chrome tab
async function saveCurrentTab() {
  try {
    const queryOptions = { active: true, currentWindow: true };
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

saveBtn.addEventListener("click", handleSaveInput());
deleteBtn.addEventListener("dblclick", deleteItems);
tabBtn.addEventListener("click", saveCurrentTab);

ulElement.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button || !ulElement.contains(button)) return;

  if (button.classList.contains("li-delete-btn")) {
    const li = button.closest("li");
    return deleteItem(li);
  }

  if (button.classList.contains("li-edit-btn")) {
    const li = button.closest("li");
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
