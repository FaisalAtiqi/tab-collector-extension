import { beforeEach, describe, expect, test } from "vitest";
import { loadItems, persistItems, clearItems } from "../src/storage";

const STORAGE_KEY = "savedItems";

// Clear localStorage before each test to ensure a clean state
beforeEach(() => {
  localStorage.clear();
});

// Test cases for the loadItems function
describe("loadItems", () => {
  test("returns an empty array when no items are stored", () => {
    expect(loadItems()).toEqual([]);
  });

  test("returns the stored items when valid data exists", () => {
    const items = ["Google", "YouTube"];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    expect(loadItems()).toEqual(items);
  });

  test("returns an empty array if localStorage contains invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "Google, YouTube");
    expect(loadItems()).toEqual([]);
  });

  test("returns an empty array if localStorage contains Non-array JSON", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(123));
    expect(loadItems()).toEqual([]);
  });

  test("filters out invalid items and trims valid strings", () => {
    const mixedItems = ["Google", 123, "  YouTube  ", "", null, "GitHub"];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mixedItems));

    const expectedItems = ["Google", "YouTube", "GitHub"];
    expect(loadItems()).toEqual(expectedItems);
  });
});

// Test cases for the persistItems function
describe("persistItems", () => {
  test("saves the provided items to localStorage", () => {
    const items = ["Google", "YouTube"];

    persistItems(items);

    const storedValue = localStorage.getItem(STORAGE_KEY);
    expect(storedValue).toBe(JSON.stringify(items));
  });
});

// Test cases for the clearItems function
describe("clearItems", () => {
  test("removes saved items from localStorage", () => {
    const items = ["Google", "YouTube"];

    persistItems(items);
    clearItems();

    const storedValue = localStorage.getItem(STORAGE_KEY);
    expect(storedValue).toBeNull();
  });
});
