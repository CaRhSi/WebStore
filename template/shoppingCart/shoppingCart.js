$(document).ready(function () {
  let itemNumber = 0;
  let product = [];

  if (localStorage.getItem("items")) {
    products = JSON.parse(localStorage.getItem("items"));
    itemNumber = products.length;
  }
  $(".numberOfItems").text(itemNumber);

  // Update button text based on cart contents
  function updateContinueButton() {
    const cartItems = JSON.parse(localStorage.getItem("items") || "[]");
    if (cartItems.length === 0) {
      $("#continueButton").text("Continue Shopping").attr("onclick", "location.href='/pages/shop/shop.html'");
    } else {
      $("#continueButton").text("Continue to Checkout").attr("onclick", "location.href='checkout/checkout.html'");
    }
  }

  // Initial check to update the button text
  updateContinueButton();

  // when the user clicks the shopping cart button, update .modal-body with the items in the cart
  $(".buttonWrapper").click(function () {
      if (localStorage.getItem("items")) {
          products = JSON.parse(localStorage.getItem("items"));

          let modalBody = $(".modal-body");
          modalBody.empty(); // empty the initial contents of modal body before adding new items

          // render products name, price, and quantity
          products.map((product) => {
              modalBody.append(
                  `<div class="productWrapper" id="${product.name}">
                      <div id="productInfo">
                          <div class="name">${product.name} - $${product.price}/item</div>
                          <div class="quantity">x ${product.quantity}</div>
                      </div>
                      <div id="actions">
                          <button class="btn btn-primary increaseQuantity" id="${product.name}">
                              +
                          </button>
                          <button class="btn btn-danger decreaseQuantity" id="${product.name}">
                              -
                          </button>               
                      </div>
                  </div>`
              );
          });

          $(".increaseQuantity").click(function () {
              // get the id attribute of the button
              let productName = $(this).attr("id");
              // match the productName to the selected item inside products array
              let product = products.find((product) => product.name === productName);
              // then increase the selected item quantity by 1
              product.quantity++;

              // update the quantity div's text - go up to productWrapper level, and then find the div with .quantity class
              $(this)
                  .closest(".productWrapper") // get the closest productWrapper div
                  .find(".quantity") // get the quantity div
                  .text(`x ${product.quantity}`); // update the text of the quantity

              // update the items in localStorage
              localStorage.setItem("items", JSON.stringify(products));
          });

          $(".decreaseQuantity").click(function () {
              // get the id attribute of the button
              let productName = $(this).attr("id");
              // match the productName to the selected item inside products array
              let product = products.find((product) => product.name === productName);
              // then decrease the selected item quantity by 1
              product.quantity--;

              // if quantity is 0, remove the product from the array and the DOM
              if (product.quantity === 0) {
                  products = products.filter((item) => item.name !== productName);
                  $(this).closest(".productWrapper").remove();
              } else {
                  // update the quantity div's text - go up to productWrapper level, and then find the div with .quantity class
                  $(this)
                      .closest(".productWrapper") // get the closest productWrapper div
                      .find(".quantity") // get the quantity div
                      .text(`x ${product.quantity}`); // update the text of the quantity
              }

              // update the items in localStorage
              localStorage.setItem("items", JSON.stringify(products));
          });
      }
  });
});
