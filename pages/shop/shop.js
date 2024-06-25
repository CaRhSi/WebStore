$(document).ready(() => {
  // Load the header.html into the header div, once it's loaded execute callback to add class to headerHome div
  $("#header").load("/template/header/header.html", () => {
      $("#headerShop")
          .removeClass()
          .addClass("nav-link active text-black fw-bold");
  });

  // Load the footer.html into the footer div, once it's loaded execute callback to add class to footerHome div
  $("#footer").load("/template/footer/footer.html", () => {
      $("#footerShop")
          .removeClass()
          .addClass("nav-link active text-black fw-bold");
  });

  // Load shoppingCart.html
  $("#shoppingCart").load("/template/shoppingCart/shoppingCart.html");
  
  // Ensure click event listener is attached only once
  $(document).off('click', '.add-to-cart').on('click', '.add-to-cart', function(event) {
      event.stopPropagation(); // Prevent the card click event from triggering
      console.log('Add to cart button clicked');

      let products = [];

      // Populate the products array with the current product's info
      if (localStorage.getItem("items")) {
          products = JSON.parse(localStorage.getItem("items"));
      }

      const itemElement = $(this).siblings(".card-body").find(".card-text").text(); // Supreme Goblin$150
      const itemName = itemElement.split("$")[0].trim(); // Supreme Goblin
      const itemPrice = itemElement.split("$")[1].trim(); // 150
      const itemImage = $(this).siblings(".card-img-top").attr("src"); // Get the image source URL

      // Check if the item is already in the cart
      let itemExists = false;
      products.forEach((product) => {
          if (product.name === itemName) {
              itemExists = true;
              product.quantity += 1;
          }
      });

      // If the item is not in the cart, add it to the cart
      if (!itemExists) {
          products.push({
              name: itemName,
              price: itemPrice,
              quantity: 1,
              image: itemImage // Store the image URL
          });
      }

      // Save the products array to localStorage
      localStorage.setItem("items", JSON.stringify(products));

      // Open shoppingCartButton.html and update .numberOfItems div
      $("#shoppingCart").load("/template/shoppingCart/shoppingCart.html", () => {
          $(".numberOfItems").text(products.reduce((total, product) => total + product.quantity, 0));
      });
  });
});
