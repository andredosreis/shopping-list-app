document.addEventListener("DOMContentLoaded", () => {
    const addItemButton = document.getElementById("addItemButton");
    const itemInput = document.getElementById("itemInput");
    const shoppingList = document.getElementById("shoppingList");
    const suggestionsBox = document.createElement("ul");
    suggestionsBox.id = "suggestions";
    document.querySelector(".input-section").appendChild(suggestionsBox);
    const purchasedList = document.getElementById("purchasedList");

    let items = JSON.parse(localStorage.getItem("shoppingList")) || [];
    let purchasedItems = JSON.parse(localStorage.getItem("purchasedList")) || [];
    let editingIndex = null; // Index of item being edited in shopping list
    let editingPurchasedIndex = null; // Index of item being edited in purchased list

    // Render items in the shopping list and purchased list
    const renderItems = () => {
        shoppingList.innerHTML = "";
        items.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${item}
                <span class="remove-item" data-index="${index}">Remove</span>
                <span class="mark-purchased" data-index="${index}">Mark as Purchased</span>
                <span class="edit-item" data-index="${index}">Edit</span>
            `;
            shoppingList.appendChild(li);
        });

        purchasedList.innerHTML = "";
        purchasedItems.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${item}
                <span class="edit-purchased-item" data-index="${index}">Edit</span>
                <span class="move-back" data-index="${index}">Move Back</span>
            `;
            li.classList.add("purchased-item");
            purchasedList.appendChild(li);
        });
    };

    // Mark an item as purchased and move it to the purchased list
    const markAsPurchased = (index) => {
        const item = items.splice(index, 1)[0];
        purchasedItems.push(item);
        updateLocalStorage();
        renderItems();
    };

    // Add a new item or update an edited item
    const addItem = (item) => {
        if (item) {
            if (editingIndex !== null) {
                items[editingIndex] = item;
                editingIndex = null;
            } else if (editingPurchasedIndex !== null) {
                purchasedItems[editingPurchasedIndex] = item;
                editingPurchasedIndex = null;
            } else {
                items.push(item);
            }
            itemInput.value = "";
            updateLocalStorage();
            renderItems();
        }
    };

    // Remove an item from the shopping list
    const removeItem = (index) => {
        items.splice(index, 1);
        updateLocalStorage();
        renderItems();
    };

    // Update local storage with the current lists
    const updateLocalStorage = () => {
        localStorage.setItem("shoppingList", JSON.stringify(items));
        localStorage.setItem("purchasedList", JSON.stringify(purchasedItems));
    };

    // Edit an item in the shopping list
    const editItem = (index) => {
        itemInput.value = items[index];
        editingIndex = index;
    };

    // Edit an item in the purchased list
    const editPurchasedItem = (index) => {
        itemInput.value = purchasedItems[index];
        editingPurchasedIndex = index;
    };

    // Move an item back from purchased list to shopping list
    const moveBackToShoppingList = (index) => {
        const item = purchasedItems.splice(index, 1)[0];
        items.push(item);
        updateLocalStorage();
        renderItems();
    };

    // Event listener for shopping list actions
    shoppingList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            const index = e.target.getAttribute("data-index");
            removeItem(index);
        } else if (e.target.classList.contains("mark-purchased")) {
            const index = e.target.getAttribute("data-index");
            markAsPurchased(index);
        } else if (e.target.classList.contains("edit-item")) {
            const index = e.target.getAttribute("data-index");
            editItem(index);
        }
    });

    // Event listener for purchased list actions
    purchasedList.addEventListener("click", (e) => {
        if (e.target.classList.contains("edit-purchased-item")) {
            const index = e.target.getAttribute("data-index");
            editPurchasedItem(index);
        } else if (e.target.classList.contains("move-back")) {
            const index = e.target.getAttribute("data-index");
            moveBackToShoppingList(index);
        }
    });

    // Fetch product suggestions from the API based on query
    const fetchSuggestions = async (query) => {
        try {
            const response = await fetch(`/search?q=${query}`);
            const products = await response.json();
            return products.map(product => ({
                name: product.name,
                brand: product.brand,
                imageUrl: product.imageUrl
            }));
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            return [];
        }
    };

    // Display product suggestions in the interface
    const showSuggestions = async (query) => {
        const suggestions = await fetchSuggestions(query);
        suggestionsBox.innerHTML = "";
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement("li");
            suggestionItem.classList.add("suggestion-item");

            // Add product image
            if (suggestion.imageUrl) {
                const image = document.createElement("img");
                image.src = suggestion.imageUrl;
                image.alt = suggestion.name;
                image.classList.add("product-image");
                suggestionItem.appendChild(image);
            }

            // Add product name
            const productName = document.createElement("span");
            productName.textContent = suggestion.name;
            suggestionItem.appendChild(productName);

            suggestionsBox.appendChild(suggestionItem);

            // Add item when a suggestion is clicked
            suggestionItem.addEventListener("click", () => {
                addItem(suggestion.name);
                suggestionsBox.innerHTML = "";
            });
        });
    };

    // Event listeners for adding and managing items
    addItemButton.addEventListener("click", () => addItem(itemInput.value));

    itemInput.addEventListener("input", (e) => {
        const query = e.target.value.trim();
        if (query.length > 1) {
            showSuggestions(query);
        } else {
            suggestionsBox.innerHTML = "";
        }
    });

    renderItems();
});
