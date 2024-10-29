document.addEventListener("DOMContentLoaded", () => {
    const addItemButton = document.getElementById("addItemButton");
    const itemInput = document.getElementById("itemInput");
    const shoppingList = document.getElementById("shoppingList");
    const suggestionsBox = document.createElement("ul");
    suggestionsBox.id = "suggestions";
    document.querySelector(".input-section").appendChild(suggestionsBox);

    let items = JSON.parse(localStorage.getItem("shoppingList")) || [];

    const renderItems = () => {
        shoppingList.innerHTML = "";
        items.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${item} <span class="remove-item" data-index="${index}">Remove</span>`;
            shoppingList.appendChild(li);
        });
    };

    const addItem = (item) => {
        if (item) {
            items.push(item);
            itemInput.value = "";
            updateLocalStorage();
            renderItems();
        }
    };

    const removeItem = (index) => {
        items.splice(index, 1);
        updateLocalStorage();
        renderItems();
    };

    const updateLocalStorage = () => {
        localStorage.setItem("shoppingList", JSON.stringify(items));
    };

    // Função para buscar produtos da API
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

    // Mostrar sugestões na interface
    const showSuggestions = async (query) => {
        const suggestions = await fetchSuggestions(query);
        suggestionsBox.innerHTML = "";
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement("li");
            suggestionItem.classList.add("suggestion-item");
            
            // add image of the product
            if (suggestion.imageUrl) {
                const image = document.createElement("img");
                image.src = suggestion.imageUrl;
                image.alt = suggestion.name;
                image.classList.add("product-image");
                suggestionItem.appendChild(image);
            }
            
            // add name product
            const productName = document.createTextNode(suggestion.name);
            suggestionItem.appendChild(productName);
            
            suggestionsBox.appendChild(suggestionItem);
    
            // Add item to click in the sugestion
            suggestionItem.addEventListener("click", () => {
                addItem(suggestion.name);
                suggestionsBox.innerHTML = "";
            });
        });
    };

    // Event Listeners
    addItemButton.addEventListener("click", () => addItem(itemInput.value));

    shoppingList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            const index = e.target.getAttribute("data-index");
            removeItem(index);
        }
    });

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
