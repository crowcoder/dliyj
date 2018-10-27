let GlblModule = (function () {

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    let all_data = {};
    let higest_price = 0;

    let dePriceLabel = document.querySelector("#selectedMaxPrice");
    let dePriceRange = document.querySelector("#priceMax");

    let search = function () {
        let rangeValue = parseFloat(dePriceRange.value);
        let max = (rangeValue / 100.00) * higest_price;
        let filtered = all_data.products.filter(p => p.ListPrice <= max);

        const prod_name = document.querySelector("#productName").value;
        if (prod_name) {
            filtered = filtered.filter(n => n.ProductName.toLowerCase().includes(prod_name.toLowerCase()));
        }

        if (!document.querySelector("#categoryBikes").checked) {
            filtered = filtered.filter(b => b.ProductCategoryID !== 1);
        }

        if (!document.querySelector("#categoryComponents").checked) {
            filtered = filtered.filter(b => b.ProductCategoryID !== 2);
        }

        if (!document.querySelector("#categoryClothing").checked) {
            filtered = filtered.filter(b => b.ProductCategoryID !== 3);
        }

        if (!document.querySelector("#categoryAccessories").checked) {
            filtered = filtered.filter(b => b.ProductCategoryID !== 4);
        }

        buildProductList(filtered);
    };

    let load_data = function () {
        let theData = {};
        fetch("./data.json").then(function (response) {
            return response.json();
        }).then(function (myjson) {
            //console.log(JSON.stringify(myjson));
            buildProductList(myjson.products);
            all_data = myjson;
        }).then(function () {
            dePriceRange.value = 100;
            let event = new Event('change');
            dePriceRange.dispatchEvent(event);
        });
    };

    dePriceRange.addEventListener('change', function (element) {
        
        let the_products = all_data.products;

        for (let i = 0; i < the_products.length; i++) {
            if (the_products[i].ListPrice > higest_price) {
                higest_price = the_products[i].ListPrice;
            }
        }

        let rangeValue = parseFloat(dePriceRange.value);
        let max = (rangeValue / 100.00) * higest_price;

        dePriceLabel.innerHTML = formatter.format(max);

        search();
    });

    document.querySelector("#productName").addEventListener('keyup', search);
    document.querySelector("#productName").addEventListener('search', search);
    document.querySelector("#categoryBikes").addEventListener('change', search);
    document.querySelector("#categoryComponents").addEventListener('change', search);
    document.querySelector("#categoryClothing").addEventListener('change', search);
    document.querySelector("#categoryAccessories").addEventListener('change', search);

    let img_error_handler = function (message, source, lineno, colno, error) {
        this.onerror = null;
        this.src = './images/NoImage.png';
    };

    function get_category(cat_id) {
        return cat_id === 1 ? 'Bikes' : cat_id === 2 ? 'Components' : cat_id === 3 ? 'Clothing' : cat_id === 4 ? 'Accessories' : 'Unknown';
    }

    function buildProductList(products) {
        let product_list_div = document.querySelector('#product_list');

        product_list_div.innerHTML = null;

        for (let i = 0; i < products.length; i++) {

            let highlight = 'row_normal';
            if (i % 2 === 0) {
                highlight = 'row_highlighted';
            }

            //The entire row
            let product_row_div = document.createElement('div');
            product_row_div.className = `row paddedrow ${highlight}`;

            //Cell to contain all details except image
            let product_details_div = document.createElement('div');
            product_details_div.className = "col-md-8";

            // Product Name
            let product_description_div = document.createElement('div');
            let product_description = document.createTextNode(products[i].ProductName);
            product_description_div.appendChild(product_description);
            product_details_div.appendChild(product_description_div);

            //Product List Price
            let product_list_price_div = document.createElement('div');
            let formatted_list_price = formatter.format(products[i].ListPrice);
            let price = document.createTextNode(formatted_list_price);
            product_list_price_div.appendChild(price);
            product_details_div.appendChild(product_list_price_div);

            //Category
            let product_cat_div = document.createElement('div');
            let product_cat_name = document.createTextNode(get_category(products[i].ProductCategoryID));
            product_cat_div.appendChild(product_cat_name);
            product_details_div.appendChild(product_cat_div);

            let product_image_div = document.createElement('div');
            product_image_div.className = 'col-md';

            let product_image = document.createElement('img');
            product_image.onerror = img_error_handler;
            product_image.src = `./images/product_${products[i].ProductID}.png`;
            product_image_div.appendChild(product_image);

            //Add to Cart Button
            let add_to_cart_div = document.createElement('div');
            add_to_cart_div.className = 'col-md';
            let add_to_cart_btn = document.createElement('button');
            add_to_cart_btn.className = "btn btn-primary";
            add_to_cart_btn.textContent = 'Add To ';
            let cart_icon_span = document.createElement('span');
            cart_icon_span.className = "fas fa-cart-plus";
            add_to_cart_btn.appendChild(cart_icon_span);
            add_to_cart_div.appendChild(add_to_cart_btn);

            product_row_div.appendChild(product_details_div);
            product_row_div.appendChild(product_image_div);
            product_row_div.appendChild(add_to_cart_div);

            product_list_div.appendChild(product_row_div);

        }
    }

    return {
        LoadData: load_data,
        AllData: all_data
    }
})();
