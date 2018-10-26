let GlblModule = (function () {

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    let all_data = {};

    let dePriceLabel = document.querySelector("#selectedMaxPrice");
    let dePriceRange = document.querySelector("#priceMax");;

    let load_data = function () {
        let theData = {};
        fetch("./data.json").then(function (response) {
            return response.json();
        }).then(function (myjson) {
            //console.log(JSON.stringify(myjson));
            buildProductList(myjson);
            all_data = myjson;
        }).then(function () {

            dePriceRange.addEventListener('change', function (element) {
                let highestPrice = 0;
                let the_products = all_data.products;

                for (let i = 0; i < the_products.length; i++) {
                    if (the_products[i].ListPrice > highestPrice) {
                        highestPrice = the_products[i].ListPrice;
                    }
                }

                let rangeValue = parseFloat(dePriceRange.value);
                let max = (rangeValue / 100.00) * highestPrice;

                dePriceLabel.innerHTML = formatter.format(max);
            });
        });
    };

    let img_error_handler = function (message, source, lineno, colno, error) {
        this.onerror = null;
        this.src = './images/NoImage.png';
    };

    function get_category(cat_id) {
        return cat_id === 1 ? 'Bikes' : cat_id === 2 ? 'Components' : cat_id === 3 ? 'Clothing' : cat_id === 4 ? 'Accessories' : 'Unknown';
    }

    function buildProductList(allData) {
        let product_list_div = document.querySelector('#product_list');

        for (let i = 0; i < allData.products.length; i++) {

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
            let product_description = document.createTextNode(allData.products[i].ProductName);
            product_description_div.appendChild(product_description);
            product_details_div.appendChild(product_description_div);

            //Product List Price
            let product_list_price_div = document.createElement('div');
            let price = document.createTextNode(`$${allData.products[i].ListPrice}`);
            product_list_price_div.appendChild(price);
            product_details_div.appendChild(product_list_price_div);

            //Category
            let product_cat_div = document.createElement('div');
            let product_cat_name = document.createTextNode(get_category(allData.products[i].ProductCategoryID));
            product_cat_div.appendChild(product_cat_name);
            product_details_div.appendChild(product_cat_div);

            let product_image_div = document.createElement('div');
            product_image_div.className = 'col-md';

            let product_image = document.createElement('img');
            product_image.onerror = img_error_handler;
            product_image.src = `./images/product_${allData.products[i].ProductID}.png`;
            product_image_div.appendChild(product_image);

            //Add to Cart Button
            let add_to_cart_div = document.createElement('div');
            add_to_cart_div.className = 'col-md';
            let add_to_cart_btn = document.createElement('button');
            add_to_cart_btn.textContent = 'Add';
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
