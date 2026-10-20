let inputElement = document.getElementById("input-element");
let saveBtn = document.getElementById("save-btn");
let deleteBtn = document.getElementById("delete-btn");
let ulElement = document.getElementById("ul-element");
let tabBtn = document.getElementById("tab-btn");

let savedItems = [];
const leadsFromLocalStorage = localStorage.getItem("savedItems");

if (leadsFromLocalStorage) {
  const itemsFromLocalStorage = JSON.parse(leadsFromLocalStorage);
  savedItems = Object.values(itemsFromLocalStorage);

  renderItems();
}

function handleAddItem(item) {
  savedItems.push(item);
  localStorage.setItem("savedItems", JSON.stringify(savedItems));
}

function renderItems() {
  ulElement.innerHTML = "";

  for (let i = 0; i < savedItems.length; i++) {
    let listItem = `
    <li>
      <a href='${savedItems[i]}' target='_blank'>
        ${savedItems[i]}
      </a>
    </li>
    `;

    ulElement.innerHTML += listItem;
  }
}

function checkAndAdd(event) {
  if (event.type === "click" || event.key === "Enter") {
    const inputValue = inputElement.value.trim();
    if (inputValue === "") return;

    handleAddItem(inputValue);
    renderItems();
    inputElement.value = "";
  }
}

function deleteTabs() {
  savedItems = [];
  localStorage.clear("savedItems");
  ulElement.innerHTML = "";
}

async function saveTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  if (tab && tab.url) {
    const currentUrl = tab.url;
    handleAddItem(currentUrl);
    renderItems();
  } else {
    alert("Cannot save internal browser pages for security reasons.");
    console.warn(
      "Access denied: The browser blocks URL access on internal pages.",
    );
  }
}

saveBtn.addEventListener("click", checkAndAdd);
inputElement.addEventListener("keydown", checkAndAdd);
deleteBtn.addEventListener("dblclick", deleteTabs);
tabBtn.addEventListener("click", saveTab);
