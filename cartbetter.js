let CartModule = (function () {

    let add_cart_item = function (product) {

        let cart_item = {
            ProductID: product.ProductID,
            ProductName: product.ProductName,
            Quantity: 1,
            ListPrice: product.ListPrice,
            SubTotal: product.ListPrice
        };

        let cart_items_json = localStorage.getItem('Cart');
        let cart_items = [];

        if (!cart_items_json) {
            localStorage.setItem('Cart', JSON.stringify([cart_item]));
            cart_items = JSON.parse(localStorage.getItem('Cart'));
        } else {
            cart_items = JSON.parse(localStorage.getItem('Cart'));
            let item_in_cart = false;

            for (let idx = 0; idx < cart_items.length; idx++) {
                const element = cart_items[idx];
                if (element.ProductID === product.ProductID) {
                    element.Quantity++;
                    element.SubTotal = element.ListPrice * element.Quantity;
                    item_in_cart = true;
                    //console.error('Not really an error!');
                    break;
                }

                if (!item_in_cart) {
                    cart_items.push(cart_item);
                    localStorage.setItem('Cart', JSON.stringify(cart_items));
                }
            }
        }

        const cart = JSON.parse(localStorage.getItem('Cart'));

        let deCart = document.querySelector('#cart');

        deCart.innerHTML = null;

        const cart_dom_elements = build_cart();
        cart_dom_elements.forEach(el => deCart.appendChild(el));
    }

    function remove(product) {
        alert(product.ProductName);
    }

    let build_cart = function () {

        const cart = JSON.parse(localStorage.getItem('Cart'));
        //const cart = [ { "ProductID": 744, "ProductName": "Tartinka", "Quantity":1, "ListPrice": 88.55, "SubTotal": 88.55 }, { "ProductID": 910, "ProductName": "Rubber Baby Buggy Bumper", "Quantity":1, "ListPrice": 19.99, "SubTotal": 19.99 } ]

        let cart_items = [];

        if (cart) {

            cart.forEach(element => {

                let cart_item_div = document.createElement('div');
                cart_item_div.className = "card";

                let cart_item_body = document.createElement('div');
                cart_item_body.className = "card-body";

                let cart_item_details_div = document.createElement('div');
                cart_item_details_div.className = "card-title";
                let details = document.createTextNode(element.ProductName);
                cart_item_details_div.appendChild(details);

                let quantity_price_p = document.createElement('p');
                let qp = document.createTextNode(`Quantity: ${element.Quantity}, Unit Price: ${element.ListPrice}, Subtotal: ${element.Quantity * element.ListPrice}`);
                quantity_price_p.appendChild(qp);
                cart_item_details_div.appendChild(quantity_price_p);

                cart_item_body.appendChild(cart_item_details_div);

                let cart_item_delete_btn = document.createElement('button');
                cart_item_delete_btn.className = "btn btn-sm btn-warning";
                cart_item_delete_btn.textContent = "Remove Item ";
                cart_item_delete_btn.addEventListener('click', remove.bind(this, element));

                let cart_item_delete_span = document.createElement('span');
                cart_item_delete_span.className = "fas fa-trash-alt";
                cart_item_delete_btn.appendChild(cart_item_delete_span);

                cart_item_div.appendChild(cart_item_body);
                cart_item_div.appendChild(cart_item_delete_btn);

                //deCart.appendChild(cart_item_div);
                cart_items.push(cart_item_div);
            });
        }
        return cart_items;
    }


    return {
        AddToCart: add_cart_item,
        BuildCart: build_cart
    };

})();