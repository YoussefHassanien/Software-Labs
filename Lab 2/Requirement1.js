const items = [];
const transactions = [];
const categories = [];
const customFields = {};

/**
 * Perform various inventory operations.
 * @param {string} action - The action to perform.
 * @param {Array} params - The parameters for the action.
 */
function performInventoryAction(action, params) {
  if (["add", "edit", "removeItem"].includes(action)) {
    handleItemActions(action, params);
  } else if (["sale", "restock"].includes(action)) {
    handleStockActions(action, params);
  } else {
    handleOtherActions(action, params);
  }
}

/**
 * Handle item-related actions.
 * @param {string} action - The action to perform.
 * @param {Array} params - The parameters for the action.
 */
function handleItemActions(action, params) {
  if (action === "add") {
    const newItem = {
      name: params[0],
      category: params[1],
      quantity: params[2],
      price: params[3],
      unit: params[4],
      added: new Date(),
      customFields: params[5] || {},
    };
    items.push(newItem);
    if (!categories.includes(params[1])) categories.push(params[1]);
    transactions.push({ type: "add", item: newItem });
  } else if (action === "edit" && items[params[0]]) {
    transactions.push({
      type: "edit",
      old: items[params[0]],
      new: params.slice(1),
    });
    items[params[0]] = {
      ...items[params[0]],
      name: params[1],
      category: params[2],
      quantity: params[3],
      price: params[4],
      unit: params[5],
      customFields: params[6] || {},
    };
  } else if (action === "removeItem" && items[params[0]]) {
    transactions.push({ type: "delete", item: items[params[0]] });
    items.splice(params[0], 1);
  }
  displayDashboard();
}

/**
 * Handle stock-related actions.
 * @param {string} action - The action to perform.
 * @param {Array} params - The parameters for the action.
 */
function handleStockActions(action, params) {
  for (let item of items) {
    if (item.name === params[0]) {
      if (action === "sale" && item.quantity >= params[1]) {
        item.quantity -= params[1];
        transactions.push({
          type: "sale",
          item,
          quantitySold: params[1],
          date: new Date(),
        });
        console.log(`Sold ${params[1]} ${item.unit} of ${item.name}`);
      } else if (action === "restock") {
        item.quantity += params[1];
        transactions.push({
          type: "restock",
          item,
          quantityRestocked: params[1],
          date: new Date(),
        });
        console.log(`Restocked ${params[1]} ${item.unit} of ${item.name}`);
      }
      break;
    }
  }
}

/**
 * Handle other actions.
 * @param {string} action - The action to perform.
 * @param {Array} params - The parameters for the action.
 */
function handleOtherActions(action, params) {
  if (action === "search") {
    const results = items.filter((item) =>
      [item.name, item.category, item.price].some((value) =>
        value.toString().toLowerCase().includes(params[0].toLowerCase())
      )
    );
    console.log(
      results
        .map(
          (item) =>
            `${item.name} (${item.category}) - ${item.quantity} ${item.unit} @ $${item.price}`
        )
        .join("\n")
    );
  } else if (action === "viewInventory") {
    console.log(
      "=== Inventory ===",
      items
        .map(
          (item) =>
            `${item.name} (${item.category}) - ${item.quantity} ${item.unit} @ $${item.price}`
        )
        .join("\n")
    );
  } else if (action === "exportAll") {
    console.log(
      "CSV:\n" +
        ["Name,Category,Quantity,Price,Unit,AddedAt"]
          .concat(items.map((item) => Object.values(item).join(",")))
          .join("\n")
    );
  } else if (action === "viewAllTransactions") {
    console.log(
      "Transactions:\n",
      transactions
        .map((transaction) => `${transaction.type} - ${transaction.item.name}`)
        .join("\n")
    );
  } else if (action === "viewItemAge") {
    console.log(
      items
        .map(
          (item) =>
            `${item.name}: ${Math.floor(
              (new Date() - new Date(item.added)) / (1000 * 60 * 60 * 24)
            )}d`
        )
        .join("\n")
    );
  } else if (action === "import") {
    params.forEach((item) =>
      performInventoryAction("add", [
        item.name,
        item.category,
        item.quantity,
        item.price,
        item.unit,
      ])
    );
  } else if (action === "addField" && !customFields[params[0]]) {
    customFields[params[0]] = null;
  } else if (action === "updateCustomField") {
    const item = items.find((item) => item.name === params[0]);
    if (item) {
      item.customFields[params[1]] = params[2];
    }
  }
}

/**
 * Display the dashboard with the current inventory status.
 */
function displayDashboard() {
  console.log(
    "=== Dashboard ===\nItems: " +
      items.length +
      "\nTotal: $" +
      items
        .reduce((total, item) => total + item.quantity * item.price, 0)
        .toFixed(2) +
      "\nCategories: " +
      categories.join(", ")
  );
}

/**
 * Main function to run inventory tests.
 */
function main() {
  console.log("Running inventory tests...");

  performInventoryAction("add", ["Apple", "Fruit", 10, 1.5, "kg"]);
  performInventoryAction("add", ["Banana", "Fruit", 5, 1, "kg"]);
  performInventoryAction("add", ["Orange", "Fruit", 3, 2, "kg"]);
  performInventoryAction("add", ["Milk", "Dairy", 5, 3, "litre"]);

  performInventoryAction("sale", ["Apple", 2]);
  performInventoryAction("restock", ["Milk", 2]);

  performInventoryAction("search", ["mil"]);
  performInventoryAction("viewInventory");
  performInventoryAction("viewItemAge");

  performInventoryAction("exportAll");
  performInventoryAction("viewAllTransactions");

  performInventoryAction("import", [
    { name: "Pineapple", category: "Fruit", quantity: 5, price: 3, unit: "kg" },
  ]);

  performInventoryAction("addField", ["Origin"]);
  performInventoryAction("updateCustomField", ["Apple", "Origin", "India"]);
}

main();
