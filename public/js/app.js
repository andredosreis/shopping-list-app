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

    // Render items in the shopping list and purchased list
    const renderItems = () => {
        // Render items in shopping list
        shoppingList.innerHTML = "";
        items.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${item} <span class="remove-item" data-index="${index}">Remove</span> <span class="mark-purchased" data-index="${index}">Mark as Purchased</span>`;
            shoppingList.appendChild(li);
        });

        // Render items in purchased list
        purchasedList.innerHTML = "";
        purchasedItems.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
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

    // Add new item to the shopping list
    const addItem = (item) => {
        if (item) {
            items.push(item);
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

    // Event listener for shopping list actions
    shoppingList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            const index = e.target.getAttribute("data-index");
            removeItem(index);
        }
        if (e.target.classList.contains("mark-purchased")) {
            const index = e.target.getAttribute("data-index");
            markAsPurchased(index);
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
