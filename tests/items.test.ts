import { describe, expect, test } from "vitest";
import { addItem, deleteItem, updateItem } from "../src/items";

// Test cases for addItem function
describe("addItem", () => {
  test("adds a new item successfully", () => {
    const items = ["Google"];

    expect(addItem(items, "GitHub")).toEqual({
      status: "success",
      items: ["Google", "GitHub"],
    });
  });

  test("rejects an item that already exists", () => {
    const items = ["Google"];

    expect(addItem(items, "Google")).toEqual({
      status: "duplicate",
    });
  });

  test("rejects an empty item", () => {
    const items = ["Google"];

    expect(addItem(items, "   ")).toEqual({
      status: "empty",
    });
  });

  test("trims whitespace from an item before adding it", () => {
    const items = ["Google"];

    expect(addItem(items, " GitHub ")).toEqual({
      status: "success",
      items: ["Google", "GitHub"],
    });
  });

  test("does not modify the original items array", () => {
    const originalItems = ["Google"];
    addItem(originalItems, "GitHub");

    expect(originalItems).toEqual(["Google"]);
  });
});

// Test cases for updateItem function
describe("updateItem", () => {
  test("successfully updates an item", () => {
    const items = ["Instagram", "GitHub"];

    expect(updateItem(items, "Google", 1)).toEqual({
      status: "success",
      items: ["Instagram", "Google"],
    });
  });

  test("trims whitespace before updating", () => {
    const items = ["Instagram", "GitHub"];

    expect(updateItem(items, "    Google   ", 1)).toEqual({
      status: "success",
      items: ["Instagram", "Google"],
    });
  });

  test("returns 'empty' for an empty value", () => {
    const items = ["Instagram", "GitHub"];

    expect(updateItem(items, "", 1)).toEqual({
      status: "empty",
    });
  });

  test("returns 'empty' for a value containing only spaces", () => {
    const items = ["Instagram", "GitHub"];

    expect(updateItem(items, "    ", 1)).toEqual({
      status: "empty",
    });
  });

  test("returns 'duplicate' if the new value already exists at another index", () => {
    const items = ["Instagram", "GitHub"];

    expect(updateItem(items, "Instagram", 1)).toEqual({
      status: "duplicate",
    });
  });

  test("returns 'unchanged' if the value is the same", () => {
    const items = ["Instagram", "GitHub"];

    expect(updateItem(items, "GitHub", 1)).toEqual({
      status: "unchanged",
    });

    expect(updateItem(items, " GitHub ", 1)).toEqual({
      status: "unchanged",
    });
  });

  test("returns 'invalid-index' when the index equals the array length", () => {
    const items = ["Instagram", "GitHub"];

    expect(updateItem(items, "Google", 2)).toEqual({
      status: "invalid-index",
    });
  });

  test("returns 'invalid-index' when the index is negative", () => {
    const items = ["Instagram", "GitHub"];

    expect(updateItem(items, "Google", -1)).toEqual({
      status: "invalid-index",
    });
  });

  test("returns 'invalid-index' when the array is empty", () => {
    const items: string[] = [];

    expect(updateItem(items, "Google", 0)).toEqual({
      status: "invalid-index",
    });
  });

  test("does not mutate the original array", () => {
    const originalItems = ["Instagram", "GitHub"];

    updateItem(originalItems, "Google", 1);
    expect(originalItems).toEqual(["Instagram", "GitHub"]);
  });
});

// Test cases for deleteItem function
describe("deleteItem", () => {
  test("successfully deletes an item", () => {
    const items = ["Instagram", "Google", "YouTube"];

    expect(deleteItem(items, 2)).toEqual({
      status: "success",
      items: ["Instagram", "Google"],
    });
  });

  test("deletes the first item", () => {
    const items = ["Instagram", "Google", "YouTube"];

    expect(deleteItem(items, 0)).toEqual({
      status: "success",
      items: ["Google", "YouTube"],
    });
  });

  test("deletes the last item", () => {
    const items = ["Instagram", "Google", "YouTube"];

    expect(deleteItem(items, items.length - 1)).toEqual({
      status: "success",
      items: ["Instagram", "Google"],
    });
  });

  test("returns 'invalid-index' for a negative index", () => {
    const items = ["Instagram", "Google", "YouTube"];

    expect(deleteItem(items, -1)).toEqual({
      status: "invalid-index",
    });
  });

  test("returns 'invalid-index' when the index equals the array length", () => {
    const items = ["Instagram", "Google", "YouTube"];

    expect(deleteItem(items, 3)).toEqual({
      status: "invalid-index",
    });
  });

  test("returns 'invalid-index' when the array is empty", () => {
    const items: string[] = [];

    expect(deleteItem(items, 0)).toEqual({
      status: "invalid-index",
    });
  });

  test("does not mutate the original array", () => {
    const originalItems = ["Instagram", "Google", "YouTube"];
    deleteItem(originalItems, 0);

    expect(originalItems).toEqual(["Instagram", "Google", "YouTube"]);
  });

  test("returns 'invalid-index' for a decimal index", () => {
    const items = ["Instagram", "Google", "YouTube"];

    expect(deleteItem(items, 1.5)).toEqual({
      status: "invalid-index",
    });
  });
});
