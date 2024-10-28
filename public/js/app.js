//Select the input field, button, and shopping list

const addItemButton = document.getElementById('addItemButton');
const itemInput = document.getElementById('itemInput');
const shoppingList = document.getElementById('shoppingList');

// Fuction to add item to the shopping List
addItemButton.addEventListener('click', () => {
    const itemText = itemInput.value.trim();
    if (itemText) {
        const li = document.createElement('li');
        li.innerHTML = `${itemText} <button class="deleteItem">Remover</button>`;
        shoppingList.appendChild(li);

    // Clear the input field after adding the item
        itemInput.value = '';
    }
});

// Function to remove an item from the shopping list
shoppingList.addEventListener('click', (e) => {
    if (e.target.classList.contains('deleteItem')) {
        // Remove the list item when the remove button is clicked
        e.target.parentElement.remove();
    }
});
// Add fade out animation before removing item
shoppingList.addEventListener('click', (e) => {
    if (e.target.classList.contains('deleteItem')) {
        const li = e.target.parentElement;

        // Add the fadeOut class for animation
        console.log('Adding fadeOut class to:', li);
        li.classList.add('fadeOut');

        // Wait for the animation to finish before removing the element
        setTimeout(() => {
            li.remove();
        }, 500); // The same duration as the CSS animation (0.5s)
    }
});
