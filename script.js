const inputElement = document.getElementById("input-element");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");
const ulElement = document.getElementById("ul-element");
const tabBtn = document.getElementById("tab-btn");

const STORAGE_KEY = "savedItems";

// Initialize saved items
function loadItems() {
  try {
    const storedItems = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");

    return Array.isArray(storedItems) ? storedItems : [];
  } catch (error) {
    return [];
  }
}

let savedItems = loadItems();

// Save items to localStorage
function persistItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
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
function renderItems() {
  ulElement.replaceChildren();

  const fragment = document.createDocumentFragment();

  for (const item of savedItems) {
    const li = document.createElement("li");
    const button = document.createElement("button");

    if (isValidUrl(item)) {
      const anchor = document.createElement("a");
      anchor.textContent = item;
      anchor.href = item;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";

      li.append(anchor);
    } else {
      li.textContent = item;
    }

    // Add delete button for each item
    button.textContent = "✕";

    li.appendChild(button);
    fragment.append(li);
  }

  ulElement.append(fragment);
}

// Add a new item
function addItem(value) {
  const item = value?.trim();

  if (!item) return;
  if (savedItems.includes(item)) {
    alert("This item is already saved.");
    return;
  }

  savedItems.push(item);
  persistItems();
  renderItems();
}

// Handle manual input
function handleSaveInput() {
  const value = inputElement.value;

  if (!value.trim()) return;

  addItem(value);
  inputElement.value = "";
}

// Delete all saved items
function deleteItems() {
  savedItems = [];
  localStorage.removeItem(STORAGE_KEY);
  renderItems();
}

// Delete single item
function deleteItem(event) {
  if (!event.target.matches("button")) return;

  const itemElement = event.target.parentElement;
  const index = Array.from(event.currentTarget.children).indexOf(itemElement);

  if (index === -1) return;

  savedItems.splice(index, 1);
  persistItems();
  itemElement.remove();
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

saveBtn.addEventListener("click", handleSaveInput);
deleteBtn.addEventListener("dblclick", deleteItems);
tabBtn.addEventListener("click", saveCurrentTab);
ulElement.addEventListener("click", deleteItem);
// Initial render
renderItems();
