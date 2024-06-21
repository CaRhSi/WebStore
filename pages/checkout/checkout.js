$(document).ready(() => {
    // Load the header.html into the header div, once it's loaded execute callback to add class to headerCheckout div
    $("#header").load("/template/header/header.html", () => {
        $("#headerCheckout")
            .removeClass()
            .addClass("nav-link active text-black fw-bold");
    });

    // Load the footer.html into the footer div, once it's loaded execute callback to add class to footerCheckout div
    $("#footer").load("/template/footer/footer.html", () => {
        $("#footerCheckout")
            .removeClass()
            .addClass("nav-link active text-black fw-bold");
    });

    // Render cart items and total price
    function renderCart() {
        let products = JSON.parse(localStorage.getItem("items")) || [];
        let cartContainer = $("#cart-items");
        let totalPrice = 0;

        cartContainer.empty(); // Clear the container

        if (products.length === 0) {
            cartContainer.append('<p>Your cart is empty.</p>');
        } else {
            products.forEach(product => {
                let itemTotal = product.price * product.quantity;
                totalPrice += itemTotal;
                cartContainer.append(`
                    <div class="cart-item" data-name="${product.name}">
                        <div class="item-name">${product.name}</div>
                        <div class="item-quantity">Quantity: ${product.quantity}</div>
                        <div class="item-price">Price: $${product.price}</div>
                        <div class="item-total">Subtotal: $${itemTotal.toFixed(2)}</div>
                        <button class="btn btn-primary increaseQuantity" data-name="${product.name}">+</button>
                        <button class="btn btn-danger decreaseQuantity" data-name="${product.name}">-</button>
                    </div>
                `);
            });
            cartContainer.append(`<h3 class="total-price">Total Price: $${totalPrice.toFixed(2)}</h3>`);
        }
    }

    // Call the renderCart function on page load
    renderCart();

    // Event delegation for increase and decrease buttons
    $(document).off('click', '.increaseQuantity').on('click', '.increaseQuantity', function() {
        let products = JSON.parse(localStorage.getItem("items")) || [];
        let productName = $(this).data("name");
        let product = products.find(p => p.name === productName);
        if (product) {
            product.quantity++;
        }

        localStorage.setItem("items", JSON.stringify(products));
        renderCart();
    });

    $(document).off('click', '.decreaseQuantity').on('click', '.decreaseQuantity', function() {
        let products = JSON.parse(localStorage.getItem("items")) || [];
        let productName = $(this).data("name");
        let product = products.find(p => p.name === productName);
        if (product) {
            product.quantity--;
            if (product.quantity === 0) {
                products = products.filter(p => p.name !== productName);
            }
        }

        localStorage.setItem("items", JSON.stringify(products));
        renderCart();
    });
});
