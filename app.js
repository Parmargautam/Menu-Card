var categoryDropdown = document.getElementById("categoryDropdown");
var itemDropdown = document.getElementById("itemDropdown");
var menuData;

// Fetch menu data from local file and populate the initial menu dropdown
fetchMenuData();

var currentBillNumber = 1; // Initialize the bill number

function resetItemDropdown() {
    itemDropdown.innerHTML = "<option value=''>Select Item</option>";
}

function resetDescriptionDiv() {
    var descriptionDiv = document.getElementById("descriptionDiv");
    descriptionDiv.innerHTML = "";
}

function populateItems() {
    var selectedCategory = categoryDropdown.value;
    resetItemDropdown(); // Reset the item dropdown

    if (selectedCategory) {
        var selectedCategoryData = menuData.menu.find(category => category.category === selectedCategory);

        // Populate item dropdown with name, description, price, and image
        selectedCategoryData.items.forEach(function (item) {
            var option = document.createElement("option");
            option.value = item.name; // Use the item name as the value

            // Create a span element to hold the text content
            var textContentSpan = document.createElement("span");
            textContentSpan.textContent = `${item.name} - ${item.description} - $${item.price.toFixed(2)}`;

            // Append the image and text content to the option
            option.appendChild(textContentSpan);

            itemDropdown.add(option);
        });
    }
}

function populateDescriptions() {
    var selectedCategory = categoryDropdown.value;
    var selectedCategoryData = menuData.menu.find(category => category.category === selectedCategory);

    var selectedItem = itemDropdown.value;
    var selectedItemData = selectedCategoryData.items.find(item => item.name === selectedItem);

    var descriptionDiv = document.getElementById("descriptionDiv");
    resetDescriptionDiv(); // Reset the description div

    if (selectedItemData) {
        var descriptionParagraph = document.createElement("p");
        descriptionParagraph.textContent = `Description: ${selectedItemData.description} | Price: $${selectedItemData.price.toFixed(2)}`;
        descriptionDiv.appendChild(descriptionParagraph);

        // Display selected item and update total amount
        displaySelectedItem(selectedItemData);
    }
}

function displaySelectedItem(item) {
    var selectedItemsList = document.getElementById("selectedItemsList");
    var listItem = document.createElement("li");

    // Delete button
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "deleteButton";
    deleteButton.onclick = function () {
        // item delete mate
        deleteItem(listItem);
    };

    //selected item display karva current bill number sathe
    listItem.textContent = `Bill ${currentBillNumber}: ${item.name} - $${item.price.toFixed(2)}`;
    listItem.appendChild(deleteButton);

    selectedItemsList.appendChild(listItem);

    // button click karya vagar total amount update karva
    updateTotalAmount();
}

function updateTotalAmount() {
    var selectedItemsList = document.getElementById("selectedItemsList");
    var subtotalParagraph = document.getElementById("subtotal");
    var cgstAmountParagraph = document.getElementById("cgstAmount");
    var sgstAmountParagraph = document.getElementById("sgstAmount");
    var totalBillParagraph = document.getElementById("totalBill");
    var subtotal = 0;
    var gstRate = 0.09; // 9% GST CGST and SGST

    // Iterate through selected items and sum up the prices
    selectedItemsList.childNodes.forEach(function (listItem) {
        var itemPrice = parseFloat(listItem.textContent.split('- $')[1]);
        subtotal += itemPrice;
    });

    // Calculate CGST and SGST amounts
    var cgstAmount = subtotal * gstRate;
    var sgstAmount = subtotal * gstRate;

    // Calculate the total bill including CGST and SGST
    var totalBill = subtotal + cgstAmount + sgstAmount;

    // Display the subtotal, CGST amount, SGST amount, and total bill
    subtotalParagraph.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    cgstAmountParagraph.textContent = `CGST (9%): $${cgstAmount.toFixed(2)}`;
    sgstAmountParagraph.textContent = `SGST (9%): $${sgstAmount.toFixed(2)}`;
    totalBillParagraph.textContent = `Total Bill (including CGST & SGST): $${totalBill.toFixed(2)}`;
}

function deleteItem(listItem) {
    listItem.remove();
    // Update the total amount after deleting an item
    updateTotalAmount();
}

function displayOrderedItem(item) {
    var orderedItemsList = document.getElementById("orderedItemsList");
    var listItem = document.createElement("li");

    listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;

    orderedItemsList.appendChild(listItem);
}

function fetchMenuData() {
    // Change the path to your local JSON file
    const localJsonPath = 'db.json';

    fetch(localJsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            menuData = data;
            // Populate initial menu dropdown
            menuData.menu.forEach(function (category) {
                var option = document.createElement("option");
                option.value = category.category;
                option.text = category.category;
                categoryDropdown.add(option);
            });
        })
        .catch(error => {
            console.error('Error fetching menu data:', error);
        });
}

function sendOrderData() {
    var selectedItemsList = document.getElementById("selectedItemsList");

    var orderData = {
        restaurant: "Sattvik Food Store",
        items: []
    };

    // Process selected items
    selectedItemsList.childNodes.forEach(function (listItem) {
        var itemPrice = parseFloat(listItem.textContent.split('- $')[1]);
        var itemName = listItem.textContent.split('- $')[0].trim();
        orderData.items.push({ name: itemName, price: itemPrice });

        // Display ordered item
        displayOrderedItem({ name: itemName, price: itemPrice });
    });

    // Display selected items
    updateTotalAmount();

    // Log orderData to the console
    console.log('Order Data:', orderData);

    // Reset the selected items list
    resetSelectedItems();

    resetItemDropdown();
    resetDescriptionDiv();

    // Increment the bill number for the next order
    currentBillNumber++;

    // Reset the order data
    resetOrderData();

    // Send order data to Firebase
    postOrderData(orderData);
}

function resetSelectedItems() {
    var selectedItemsList = document.getElementById("selectedItemsList");
    selectedItemsList.innerHTML = ""; // Clear the selected items list
}

function resetOrderData() {
    // Reset total amount
    var subtotalParagraph = document.getElementById("subtotal");
    var cgstAmountParagraph = document.getElementById("cgstAmount");
    var sgstAmountParagraph = document.getElementById("sgstAmount");
    var totalBillParagraph = document.getElementById("totalBill");
    subtotalParagraph.textContent = "Subtotal: $0.00";
    cgstAmountParagraph.textContent = "CGST (9%): $0.00";
    sgstAmountParagraph.textContent = "SGST (9%): $0.00";
    totalBillParagraph.textContent = `Total Bill (including CGST & SGST): $0.00`;
}

function postOrderData(orderData) {
    const firebaseOrderApiUrl = 'https://menu-card-79c14-default-rtdb.firebaseio.com//orders.json';

    fetch(firebaseOrderApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(responseData => {
        console.log('Order Data posted successfully:', responseData);
    })
    .catch(error => {
        console.error('Error posting order data:', error);
    });
}




