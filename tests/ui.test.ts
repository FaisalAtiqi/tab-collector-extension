import { describe, expect, test } from "vitest";
import { renderItems, createLiElementWithButtons } from "../src/ui";

// Test cases for the renderItems function
describe("renderItems", () => {
  test("renders the correct number of list items", () => {
    const ulElement = document.createElement("ul");
    const saveItems = ["Google", "https://www.instagram.com", "123"];

    renderItems(ulElement, saveItems);
    const liElements = ulElement.querySelectorAll("li");

    expect(liElements.length).toBe(saveItems.length);
  });

  test("each <li> contains the correct text or link", () => {
    const ulElement = document.createElement("ul");
    const saveItems = ["Google", "https://www.instagram.com", "123"];

    renderItems(ulElement, saveItems);

    const liElements = ulElement.querySelectorAll("li");

    liElements.forEach((li, index) => {
      const item = saveItems[index];
      const child = li.querySelector("a, span");
      expect(child).not.toBeNull();

      expect(child?.textContent).toBe(item);

      if (item.startsWith("http")) {
        expect(child?.tagName).toBe("A");
        expect(child?.getAttribute("href")).toBe(item);
      } else {
        expect(child?.tagName).toBe("SPAN");
      }
    });
  });

  test("clears previously rendered items when called with an empty array", () => {
    const ulElement = document.createElement("ul");
    const saveItems = ["Google", "Instagram", "123"];

    renderItems(ulElement, saveItems);

    const newSaveItems: string[] = [];

    renderItems(ulElement, newSaveItems);

    const liElements = ulElement.querySelectorAll("li");
    expect(liElements.length).toBe(newSaveItems.length);
  });

  test("replaces previously rendered items when called with a new array", () => {
    const ulElement = document.createElement("ul");
    const saveItems = ["Google", "Instagram", "YouTube"];

    renderItems(ulElement, saveItems);

    const newSaveItems = ["GitHub", "Reddit"];

    renderItems(ulElement, newSaveItems);

    const liElements = ulElement.querySelectorAll("li");
    expect(liElements.length).toBe(newSaveItems.length);

    liElements.forEach((li, index) => {
      const item = newSaveItems[index];
      const child = li.querySelector("a, span");

      expect(child?.textContent).toBe(item);
    });
  });

  test("renders no list items when the array is empty", () => {
    const ulElement = document.createElement("ul");
    const saveItems: string[] = [];

    renderItems(ulElement, saveItems);

    const liElements = ulElement.querySelectorAll("li");
    expect(liElements.length).toBe(saveItems.length);
  });

  // Test cases for the createLiElementWithButtons function
  test("creates an anchor element with the correct href for a valid URL", () => {
    const item = "https://www.instagram.com";

    const liElement = createLiElementWithButtons(item);
    const anchor = liElement.querySelector("a");

    expect(anchor).toBeInstanceOf(HTMLAnchorElement);
    expect(anchor?.getAttribute("href")).toBe(item);
  });

  test("creates a span element for a non-URL value", () => {
    const item = "Google";

    const liElement = createLiElementWithButtons(item);
    const span = liElement.querySelector("span");

    expect(span).toBeInstanceOf(HTMLSpanElement);
    expect(liElement.querySelector("a")).toBeNull();
  });

  test("sets the correct target and rel attributes for an anchor", () => {
    const item = "https://www.instagram.com";

    const liElement = createLiElementWithButtons(item);
    const anchor = liElement.querySelector("a");

    expect(anchor?.getAttribute("target")).toBe("_blank");
    expect(anchor?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  test("creates edit and delete buttons inside the list item", () => {
    const item = "Instagram";

    const liElement = createLiElementWithButtons(item);
    const editButton = liElement.querySelector(".li-edit-btn");
    const deleteButton = liElement.querySelector(".li-delete-btn");

    expect(editButton).toBeInstanceOf(HTMLButtonElement);
    expect(deleteButton).toBeInstanceOf(HTMLButtonElement);
  });

  test("sets the type attribute to button for both buttons", () => {
    const item = "Instagram";

    const liElement = createLiElementWithButtons(item);

    const editButton = liElement.querySelector(".li-edit-btn");
    const deleteButton = liElement.querySelector(".li-delete-btn");

    expect(editButton?.getAttribute("type")).toBe("button");
    expect(deleteButton?.getAttribute("type")).toBe("button");
  });
});
