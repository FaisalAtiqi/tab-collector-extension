import { beforeEach, describe, expect, test, vi } from "vitest";

describe("saving items through the UI", () => {
  // Reset the DOM, localStorage, mocks, and module cache before each test.
  beforeEach(() => {
    document.body.innerHTML = "";
    localStorage.clear();
    vi.restoreAllMocks();
    vi.resetModules();

    const inputElement = document.createElement("input");
    inputElement.id = "input-element";
    inputElement.type = "text";
    inputElement.name = "input-element";

    const divElement = document.createElement("div");
    divElement.className = "btn-container";

    const saveBtn = document.createElement("button");
    saveBtn.id = "save-btn";
    saveBtn.textContent = "SAVE INPUT";

    const tabBtn = document.createElement("button");
    tabBtn.id = "tab-btn";
    tabBtn.textContent = "SAVE TAB URL";

    const deleteBtn = document.createElement("button");
    deleteBtn.id = "delete-btn";
    deleteBtn.textContent = "DELETE ALL";

    divElement.append(saveBtn, tabBtn, deleteBtn);

    const ulElement = document.createElement("ul");
    ulElement.id = "ul-element";

    document.body.append(inputElement, divElement, ulElement);
  });

  test("saves an item when the save button is clicked", async () => {
    // Import the script after the required DOM elements have been created.
    await import("../src/script");

    // Find the input and save button.
    const inputElement =
      document.querySelector<HTMLInputElement>("#input-element");
    const saveBtn = document.querySelector<HTMLButtonElement>("#save-btn");

    // Enter an item and simulate a Save button click.
    const item = "Google";
    inputElement!.value = item;
    saveBtn!.click();

    // Verify the item is rendered correctly.
    const ulElement = document.querySelector<HTMLUListElement>("ul");
    const liElement = ulElement!.querySelector("li");
    const child = liElement!.querySelector("span");

    expect(ulElement!.childElementCount).toBe(1);
    expect(child?.textContent).toBe(item);

    // Verify the item is persisted to localStorage.
    expect(localStorage.getItem("savedItems")).toBe(JSON.stringify([item]));

    // Verify the input is cleared after successful saving.
    expect(inputElement!.value).toBe("");
  });

  test("prevents saving duplicate items and shows an alert", async () => {
    // Import the script and mock the alert.
    await import("../src/script");
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    // Find the input and save button.
    const inputElement =
      document.querySelector<HTMLInputElement>("#input-element");
    const saveBtn = document.querySelector<HTMLButtonElement>("#save-btn");

    const item = "Google";

    // Save the item for the first time.
    inputElement!.value = item;
    saveBtn!.click();

    // Attempt to save the same item again.
    inputElement!.value = item;
    saveBtn!.click();

    // Verify that the duplicate alert is displayed.
    expect(alertSpy).toHaveBeenCalledOnce();
    expect(alertSpy).toHaveBeenCalledWith("This item is already saved.");

    // Verify that the duplicate isn't added to the list or localStorage.
    const ulElement = document.querySelector<HTMLUListElement>("#ul-element");
    expect(ulElement!.childElementCount).toBe(1);
    expect(localStorage.getItem("savedItems")).toEqual(JSON.stringify([item]));

    // Verify that the input retains its value.
    expect(inputElement!.value).toBe(item);
  });

  test("deleting an individual item", async () => {
    await import("../src/script");

    const inputElement =
      document.querySelector<HTMLInputElement>("#input-element");

    // Enter an item and save it using Enter.
    const item = "Instagram";
    inputElement!.value = item;

    inputElement!.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      }),
    );

    // Find the rendered item and its delete button.
    const ulElement = document.querySelector<HTMLUListElement>("#ul-element");
    expect(ulElement!.childElementCount).toBe(1);

    const liElement = ulElement!.querySelector<HTMLLIElement>("li");
    const deleteBtn =
      liElement!.querySelector<HTMLButtonElement>(".li-delete-btn");

    // Delete the item.
    deleteBtn!.click();

    // Verify the item is removed from the UI and localStorage.
    expect(ulElement?.childElementCount).toBe(0);
    expect(localStorage.getItem("savedItems")).toBe(JSON.stringify([]));
  });

  test("saves an edited item when Enter is pressed", async () => {
    await import("../src/script");

    // Save an item.
    const inputElement =
      document.querySelector<HTMLInputElement>("#input-element");

    const item = "Instagram";
    inputElement!.value = item;
    inputElement!.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      }),
    );

    // Click its Edit button.
    const ulElement = document.querySelector<HTMLUListElement>("#ul-element");
    const liElement = ulElement!.querySelector("li");
    const editButton =
      liElement!.querySelector<HTMLButtonElement>(".li-edit-btn");

    editButton!.click();

    // Change the input value.
    const editInput =
      liElement!.querySelector<HTMLInputElement>(".li-input-on");
    expect(editInput).not.toBeNull();

    const newItem = "Google";
    editInput!.value = newItem;

    // Save item by pressing Enter key
    editInput!.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      }),
    );

    // Saving the edit re-renders the list using replaceChildren(),
    // so the original liElement reference points to a detached element.
    // Query the document to check the newly rendered elements.

    // Verify edit mode is no longer active.
    expect(document.querySelector<HTMLInputElement>(".li-input-on")).toBeNull();

    // Verify the updated text appears in the list and localStorage.
    expect(document.querySelector("span")!.textContent).toBe(newItem);
    expect(localStorage.getItem("savedItems")).toBe(JSON.stringify([newItem]));
  });

  test("saves an edited item when the Save button is clicked", async () => {
    await import("../src/script");

    // Save an item.
    const inputElement =
      document.querySelector<HTMLInputElement>("#input-element");

    const item = "Instagram";
    inputElement!.value = item;
    inputElement!.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      }),
    );

    // Click its Edit button.
    const ulElement = document.querySelector<HTMLUListElement>("#ul-element");
    const liElement = ulElement!.querySelector("li");
    const editButton =
      liElement!.querySelector<HTMLButtonElement>(".li-edit-btn");

    editButton!.click();

    // Change the input value.
    const editInput =
      liElement!.querySelector<HTMLInputElement>(".li-input-on");
    expect(editInput).not.toBeNull();

    const newItem = "Google";
    editInput!.value = newItem;

    // Save item by clicking the Save button.
    const saveButton =
      liElement!.querySelector<HTMLButtonElement>(".li-save-btn");
    expect(saveButton).not.toBeNull();

    saveButton!.click();

    // Verify edit mode is no longer active.
    expect(document.querySelector<HTMLInputElement>(".li-input-on")).toBeNull();

    // Verify the updated text appears in the list and localStorage.
    expect(document.querySelector("span")!.textContent).toBe(newItem);
    expect(localStorage.getItem("savedItems")).toBe(JSON.stringify([newItem]));
  });

  test("cancels editing when Escape is pressed", async () => {
    await import("../src/script");

    const inputElement =
      document.querySelector<HTMLInputElement>("#input-element");

    const item = "Instagram";
    inputElement!.value = item;

    inputElement!.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      }),
    );

    const ulElement = document.querySelector<HTMLUListElement>("#ul-element");
    const liElement = ulElement!.querySelector("li");

    const editButton =
      liElement!.querySelector<HTMLButtonElement>(".li-edit-btn");
    editButton!.click();

    // Change the input value to something new.
    const editInput =
      liElement!.querySelector<HTMLInputElement>(".li-input-on");

    const newItem = "Google";
    editInput!.value = newItem;

    // Cancel editing by pressing the Escape key.
    editInput!.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      }),
    );

    // Verify the original item is restored
    const originalItem = document
      .querySelector("li")!
      .querySelector("span")!.textContent;

    expect(originalItem).toBe(item);

    // Verify the edit input is no longer present.
    expect(document.querySelector<HTMLInputElement>(".li-input-on")).toBeNull();

    //  Verify localStorage still contains original item, not new item.
    expect(localStorage.getItem("savedItems")).toBe(JSON.stringify([item]));
  });

  test("cancels editing when the Cancel button is clicked", async () => {
    await import("../src/script");

    const inputElement =
      document.querySelector<HTMLInputElement>("#input-element");

    const item = "Instagram";
    inputElement!.value = item;

    inputElement!.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      }),
    );

    const ulElement = document.querySelector<HTMLUListElement>("#ul-element");
    const liElement = ulElement!.querySelector("li");

    const editButton =
      liElement!.querySelector<HTMLButtonElement>(".li-edit-btn");
    editButton!.click();

    const editInput =
      liElement!.querySelector<HTMLInputElement>(".li-input-on");

    const newItem = "Google";
    editInput!.value = newItem;

    // Cancel editing by clicking the Cancel button.
    const cancelButton =
      liElement!.querySelector<HTMLButtonElement>(".li-cancel-btn");
    expect(cancelButton).not.toBeNull();

    cancelButton!.click();

    const originalItem = document
      .querySelector("li")!
      .querySelector("span")!.textContent;

    expect(originalItem).toBe(item);

    expect(document.querySelector<HTMLInputElement>(".li-input-on")).toBeNull();
    expect(localStorage.getItem("savedItems")).toBe(JSON.stringify([item]));
  });

  test("deletes all saved items when the Delete All button is double-clicked", async () => {
    await import("../src/script");

    const inputElement =
      document.querySelector<HTMLInputElement>("#input-element");
    const saveBtn = document.querySelector<HTMLButtonElement>("#save-btn");

    // Save two different items.
    const firstItem = "Instagram";
    const secondItem = "Google";

    inputElement!.value = firstItem;
    saveBtn!.click();

    inputElement!.value = secondItem;
    saveBtn!.click();

    // Verify that the list contains two items.
    const ulElement = document.querySelector<HTMLUListElement>("#ul-element");
    expect(ulElement!.childElementCount).toBe(2);

    // Double-click the Delete All button.
    const deleteBtn = document.querySelector<HTMLButtonElement>("#delete-btn");
    deleteBtn!.dispatchEvent(
      new MouseEvent("dblclick", { bubbles: true, cancelable: true }),
    );

    // Verify that the list is empty.
    expect(ulElement!.childElementCount).toBe(0);

    // Verify that the savedItems key is removed from localStorage.
    expect(localStorage.getItem("savedItems")).toBeNull();
  });
});
