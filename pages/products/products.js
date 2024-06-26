document.addEventListener("DOMContentLoaded", async () => {
    // Load the header.html into the header div, once it's loaded execute callback to add class to headerHome div
  $("#header").load("/template/header/header.html", () => {
    $("#headerProducts")
        .removeClass()
        .addClass("nav-link active text-black fw-bold");
});

// Load the footer.html into the footer div, once it's loaded execute callback to add class to footerHome div
$("#footer").load("/template/footer/footer.html", () => {
    $("#footerProducts")
        .removeClass()
        .addClass("nav-link active text-black fw-bold");
});

    // Fetch product data from the RAWG API
    const apiKey = '4cb3fdc64f4a40228448ad9afcd63d71'; // Your RAWG API key
    const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const productsContainer = document.getElementById("products");
        const products = data.results.slice(0, 5); // Get at least 5 games

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            const platforms = product.platforms.map(platform => platform.platform.name).join(', ');

            productCard.innerHTML = `
                <img src="${product.background_image}" alt="${product.name}">
                <div class="product-info">
                    <h5 class="card-title">${product.name}</h5>
                    <p>Release Date: ${product.released}</p>
                    <p>Genre: ${product.genres.map(genre => genre.name).join(', ')}</p>
                    <p>Rating: ${product.rating}</p>
                    <p>Platforms: ${platforms}</p>
                </div>
            `;

            productsContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error fetching the products:', error);
    }
});
