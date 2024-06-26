$(document).ready(() => {
    // Initialize EmailJS
    emailjs.init("Zj83Kg4XZnwThmE5-");

    // Firebase configuration object
    const firebaseConfig = {
        apiKey: "AIzaSyBPvdVJAph50jH4EkJavdfPb-UblLFSyH0",
        authDomain: "goblin-webstore.firebaseapp.com",
        databaseURL: "https://goblin-webstore-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "goblin-webstore",
        storageBucket: "goblin-webstore.appspot.com",
        messagingSenderId: "721366070888",
        appId: "1:721366070888:web:b6b606ed0398e4c3406ddd",
        measurementId: "G-ZSGTC2GD0S"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // Load header and footer
    $("#header").load("/template/header/header.html", () => {
        $("#headerCheckout").removeClass().addClass("nav-link active text-black fw-bold");
    });
    $("#footer").load("/template/footer/footer.html", () => {
        $("#footerCheckout").removeClass().addClass("nav-link active text-black fw-bold");
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
            products.forEach((product, index) => {
                let itemTotal = product.price * product.quantity;
                totalPrice += itemTotal;
                cartContainer.append(`
                    <div class="cart-item" data-index="${index}">
                        <img src="${product.image}" alt="${product.name}" class="cart-item-img">
                        <div class="item-name">${product.name}</div>
                        <div class="item-quantity">Quantity: ${product.quantity}</div>
                        <div class="item-price">Price: $${product.price}</div>
                        <div class="item-total">Subtotal: $${itemTotal.toFixed(2)}</div>
                        <i class="fas fa-trash-alt delete-item" data-index="${index}"></i>
                    </div>
                `);
            });
            cartContainer.append(`<h3 class="total-price">Total Price: $${totalPrice.toFixed(2)}</h3>`);
        }

        // Add event listener for delete buttons
        $('.delete-item').on('click', function() {
            let index = $(this).data('index');
            products.splice(index, 1);
            localStorage.setItem('items', JSON.stringify(products));
            renderCart();
        });
    }

    // Call the renderCart function on page load
    renderCart();
});

function validateForm() {
    let isValid = true;

    const firstName = $("#firstName").val();
    const lastName = $("#lastName").val();
    const email = $("#email").val();
    const phone = $("#phone").val();
    const address = $("#address").val();
    const cardNumber = $("#cardNumber").val();
    const expiryDate = $("#expiryDate").val();
    const cvv = $("#cvv").val();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    const cardNumberPattern = /^\d{16}$/;
    const expiryDatePattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    const cvvPattern = /^\d{3}$/;

    // Validation Checks
    if (!firstName) {
        isValid = false;
        $("#firstName").addClass("is-invalid");
        $("#firstNameError").text("First name is required.");
    } else {
        $("#firstName").removeClass("is-invalid");
        $("#firstNameError").text("");
    }

    if (!lastName) {
        isValid = false;
        $("#lastName").addClass("is-invalid");
        $("#lastNameError").text("Last name is required.");
    } else {
        $("#lastName").removeClass("is-invalid");
        $("#lastNameError").text("");
    }

    if (!email || !emailPattern.test(email)) {
        isValid = false;
        $("#email").addClass("is-invalid");
        $("#emailError").text("Enter a valid email address.");
    } else {
        $("#email").removeClass("is-invalid");
        $("#emailError").text("");
    }

    if (!phone || !phonePattern.test(phone)) {
        isValid = false;
        $("#phone").addClass("is-invalid");
        $("#phoneError").text("Enter a valid 10-digit phone number.");
    } else {
        $("#phone").removeClass("is-invalid");
        $("#phoneError").text("");
    }

    if (!address) {
        isValid = false;
        $("#address").addClass("is-invalid");
        $("#addressError").text("Address is required.");
    } else {
        $("#address").removeClass("is-invalid");
        $("#addressError").text("");
    }

    if (!cardNumber || !cardNumberPattern.test(cardNumber)) {
        isValid = false;
        $("#cardNumber").addClass("is-invalid");
        $("#cardNumberError").text("Enter a valid 16-digit card number.");
    } else {
        $("#cardNumber").removeClass("is-invalid");
        $("#cardNumberError").text("");
    }

    if (!expiryDate || !expiryDatePattern.test(expiryDate)) {
        isValid = false;
        $("#expiryDate").addClass("is-invalid");
        $("#expiryDateError").text("Enter a valid expiry date (MM/YY).");
    } else {
        $("#expiryDate").removeClass("is-invalid");
        $("#expiryDateError").text("");
    }

    if (!cvv || !cvvPattern.test(cvv)) {
        isValid = false;
        $("#cvv").addClass("is-invalid");
        $("#cvvError").text("Enter a valid 3-digit CVV.");
    } else {
        $("#cvv").removeClass("is-invalid");
        $("#cvvError").text("");
    }

    if (isValid) {
        const cardLast4 = cardNumber.slice(-4);
        const items = JSON.parse(localStorage.getItem("items")).map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: (item.price * item.quantity).toFixed(2)
        }));
        const totalPrice = items.reduce((total, item) => total + parseFloat(item.subtotal), 0).toFixed(2);

        // Save order to Firebase
        saveOrderToFirebase(firstName, lastName, email, phone, address, cardLast4, items, totalPrice);

        // Send confirmation email
        sendConfirmationEmail(email, firstName, lastName, phone, address, cardLast4, items, totalPrice);

        alert("Form submitted successfully!");
    }
}

function saveOrderToFirebase(firstName, lastName, email, phone, address, cardLast4, items, totalPrice) {
    const orderData = {
        firstName,
        lastName,
        email,
        phone,
        address,
        cardLast4,
        items,
        totalPrice,
        orderDate: new Date().toISOString()
    };

    const newOrderKey = firebase.database().ref().child('orders').push().key;

    let updates = {};
    updates['/orders/' + newOrderKey] = orderData;

    return firebase.database().ref().update(updates);
}

function sendConfirmationEmail(email, firstName, lastName, phone, address, cardLast4, items, totalPrice) {
    // Create an HTML string for the items
    const itemsHtml = items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${item.subtotal}</td>
        </tr>
    `).join('');

    emailjs.send('service_6zco9pe', 'template_j7k9gf6', {
        to_name: `${firstName} ${lastName}`,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address,
        cardLast4: cardLast4,
        items: itemsHtml, // Pass the HTML string
        totalPrice: totalPrice
    })
    .then(response => {
        console.log("Email sent successfully:", response.status, response.text);
    })
    .catch(error => {
        console.error("Error sending email:", error);
    });
}
