// Menu data - could be fetched from API in production
const menuData = [
    { id: 1, name: 'Grilled Salmon', price: 24.99, description: 'Fresh Atlantic salmon' },
    { id: 2, name: 'Beef Tenderloin', price: 32.99, description: 'Premium cut beef' },
    { id: 3, name: 'Pasta Carbonara', price: 18.99, description: 'Classic Italian pasta' },
    { id: 4, name: 'Caesar Salad', price: 12.99, description: 'Fresh romaine lettuce' },
    { id: 5, name: 'Margherita Pizza', price: 16.99, description: 'Wood-fired pizza' },
    { id: 6, name: 'Chocolate Lava Cake', price: 9.99, description: 'Decadent dessert' }
];

let orderItems = [];
let totalAmount = 0;

// Initialize the page
function init() {
    displayMenu();
    populateMenuSelect();
    setupEventListeners();
}

// Display menu items
function displayMenu() {
    const menuContainer = document.getElementById('menuItems');
    
    menuData.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p class="price">$${item.price}</p>
        `;
        menuContainer.appendChild(menuItem);
    });
}

// Populate select dropdown
function populateMenuSelect() {
    const select = document.getElementById('menuItem');
    
    menuData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} - $${item.price}`;
        select.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('orderForm');
    form.addEventListener('submit', handleOrderSubmit);
}

// Handle order submission - missing proper validation
function handleOrderSubmit(e) {
    e.preventDefault();
    
    const customerName = document.getElementById('customerName').value;
    const menuItemId = parseInt(document.getElementById('menuItem').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    
    // Find the menu item - could use a Map for better performance
    let selectedItem;
    for (let i = 0; i < menuData.length; i++) {
        if (menuData[i].id === menuItemId) {
            selectedItem = menuData[i];
            break;
        }
    }
    
    if (selectedItem) {
        const orderItem = {
            name: selectedItem.name,
            price: selectedItem.price,
            quantity: quantity,
            subtotal: selectedItem.price * quantity
        };
        
        orderItems.push(orderItem);
        totalAmount += orderItem.subtotal;
        
        updateOrderSummary(customerName);
        
        // Reset form - but not the customer name (minor UX issue)
        document.getElementById('menuItem').value = '';
        document.getElementById('quantity').value = '1';
    }
}

// Update order summary display
function updateOrderSummary(customerName) {
    const summaryDiv = document.getElementById('orderSummary');
    summaryDiv.className = 'order-summary active';
    
    let summaryHTML = `<h3>Order for ${customerName}</h3>`;
    
    // Could be more efficient with template literals
    orderItems.forEach(item => {
        summaryHTML += `
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${item.subtotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    summaryHTML += `<div class="total">Total: $${totalAmount.toFixed(2)}</div>`;
    
    summaryDiv.innerHTML = summaryHTML;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Made with Bob
