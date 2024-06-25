$(document).ready(function () {
  let itemNumber = 0;
  let products = [];

  if (localStorage.getItem("items")) {
      products = JSON.parse(localStorage.getItem("items"));
      itemNumber = products.reduce((total, product) => total + product.quantity, 0);
  }
  $(".numberOfItems").text(itemNumber);

  // Update button text based on cart contents
  function updateContinueButton() {
      const cartItems = JSON.parse(localStorage.getItem("items") || "[]");
      if (cartItems.length === 0) {
          $("#continueButton").text("Continue Shopping").attr("onclick", "location.href='/pages/shop/shop.html'");
      } else {
          $("#continueButton").text("Continue to Checkout").attr("onclick", "location.href='/pages/checkout/checkout.html'");
      }
  }

  // Initial check to update the button text
  updateContinueButton();

  // Function to render the modal content
  function renderModal() {
      let modalBody = $(".modal-body");
      modalBody.empty(); // Empty the initial contents of modal body before adding new items
      let totalPrice = 0; // Initialize total price

      // Render products name, price, quantity, image, and subtotal
      products.forEach((product) => {
          let itemTotal = product.price * product.quantity;
          totalPrice += itemTotal; // Add item total to total price
          modalBody.append(
              `<div class="productWrapper" id="${product.name}">
                  <img src="${product.image}" alt="${product.name}" class="cart-item-img">
                  <div id="productInfo">
                      <div class="name">${product.name} - $${product.price}/item</div>
                      <div class="quantity">Quantity: ${product.quantity}</div>
                      <div class="subtotal">Subtotal: $${itemTotal.toFixed(2)}</div>
                  </div>
                  <div id="actions">
                      <button class="btn btn-primary increaseQuantity" data-name="${product.name}">+</button>
                      <button class="btn btn-danger decreaseQuantity" data-name="${product.name}" ${product.quantity === 1 ? 'disabled' : ''}>-</button>
                  </div>
              </div>`
          );
      });

      // Add total price at the bottom of the modal
      modalBody.append(
          `<div class="totalWrapper">
              <div class="totalLabel">Total:</div>
              <div class="totalPrice">$${totalPrice.toFixed(2)}</div>
          </div>`
      );

      // Attach event handlers
      $(".increaseQuantity").click(function () {
          // Get the data-name attribute of the button
          let productName = $(this).data("name");
          // Match the productName to the selected item inside products array
          let product = products.find((product) => product.name === productName);
          // Then increase the selected item quantity by 1
          product.quantity++;

          // Update the items in localStorage
          localStorage.setItem("items", JSON.stringify(products));
          renderModal();
      });

      $(".decreaseQuantity").click(function () {
          // Get the data-name attribute of the button
          let productName = $(this).data("name");
          // Match the productName to the selected item inside products array
          let product = products.find((product) => product.name === productName);
          // Then decrease the selected item quantity by 1
          if (product.quantity > 1) {
              product.quantity--;
          }

          // Update the items in localStorage
          localStorage.setItem("items", JSON.stringify(products));
          renderModal();
      });

      // Update item number
      itemNumber = products.reduce((total, product) => total + product.quantity, 0);
      $(".numberOfItems").text(itemNumber);
      updateContinueButton();
  }

  // When the user clicks the shopping cart button, update .modal-body with the items in the cart
  $(".buttonWrapper").click(function () {
      if (localStorage.getItem("items")) {
          products = JSON.parse(localStorage.getItem("items"));
          renderModal();
      }
  });
});
