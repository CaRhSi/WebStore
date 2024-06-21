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

  // When the user clicks the shopping cart button, update .modal-body with the items in the cart
  $(".buttonWrapper").click(function () {
      if (localStorage.getItem("items")) {
          products = JSON.parse(localStorage.getItem("items"));

          let modalBody = $(".modal-body");
          modalBody.empty(); // Empty the initial contents of modal body before adding new items

          // Render products name, price, and quantity
          products.map((product) => {
              modalBody.append(
                  `<div class="productWrapper" id="${product.name}">
                      <div id="productInfo">
                          <div class="name">${product.name} - $${product.price}/item</div>
                          <div class="quantity">x ${product.quantity}</div>
                      </div>
                      <div id="actions">
                          <button class="btn btn-primary increaseQuantity" data-name="${product.name}">
                              +
                          </button>
                          <button class="btn btn-danger decreaseQuantity" data-name="${product.name}">
                              -
                          </button>               
                      </div>
                  </div>`
              );
          });

          // Detach previous event handlers to avoid multiple bindings
          $(".increaseQuantity").off('click');
          $(".decreaseQuantity").off('click');

          console.log('Binding increaseQuantity and decreaseQuantity events');

          // Attach click event handlers for increase and decrease buttons
          $(".increaseQuantity").on('click', function () {
              console.log('Increase quantity button clicked');
              // Get the data-name attribute of the button
              let productName = $(this).data("name");
              // Match the productName to the selected item inside products array
              let product = products.find((product) => product.name === productName);
              // Then increase the selected item quantity by 1
              product.quantity++;

              // Update the quantity div's text - go up to productWrapper level, and then find the div with .quantity class
              $(this)
                  .closest(".productWrapper") // Get the closest productWrapper div
                  .find(".quantity") // Get the quantity div
                  .text(`x ${product.quantity}`); // Update the text of the quantity

              // Update the items in localStorage
              localStorage.setItem("items", JSON.stringify(products));
              updateContinueButton();
          });

          $(".decreaseQuantity").on('click', function () {
              console.log('Decrease quantity button clicked');
              // Get the data-name attribute of the button
              let productName = $(this).data("name");
              // Match the productName to the selected item inside products array
              let product = products.find((product) => product.name === productName);
              // Then decrease the selected item quantity by 1
              product.quantity--;

              // If quantity is 0, remove the product from the array and the DOM
              if (product.quantity === 0) {
                  products = products.filter((item) => item.name !== productName);
                  $(this).closest(".productWrapper").remove();
              } else {
                  // Update the quantity div's text - go up to productWrapper level, and then find the div with .quantity class
                  $(this)
                      .closest(".productWrapper") // Get the closest productWrapper div
                      .find(".quantity") // Get the quantity div
                      .text(`x ${product.quantity}`); // Update the text of the quantity
              }

              // Update the items in localStorage
              localStorage.setItem("items", JSON.stringify(products));
              updateContinueButton();
          });
      }
  });
});
