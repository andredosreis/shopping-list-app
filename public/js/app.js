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
            const response = await fetch(`/api/search?q=${query}`);
            const products = await response.json();
            return products.map(product => product.product_name);
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
            suggestionItem.textContent = suggestion;
            suggestionItem.classList.add("suggestion-item");
            suggestionsBox.appendChild(suggestionItem);

            // Adicionar item ao clicar em uma sugestão
            suggestionItem.addEventListener("click", () => {
                addItem(suggestion);
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
