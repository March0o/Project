(function() {
    const productJSONUrl = 'https://raw.githubusercontent.com/March0o/JsonProject/main/FoodData.json';
    FetchProducts(productJSONUrl); // Display products
    UpdateDisplayCart();

    // Shopping Cart Initilize   
    if (localStorage.getItem('CartData') === null) // If no cart exists
    {
        const CartData = 
        {
            'products': [],
            'total' : 0
        };
        localStorage.setItem('CartData', JSON.stringify(CartData));
    }
})();

async function FetchProducts(url)
{
    try
    {
        // Fetch Operation
        const response = await fetch(url);
        if (!response.ok) 
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Log fetch Data

        const outputSection = document.getElementById('ShopOutput') // Get output div by ID
        let sizes = ['Ultra - 30" (+' + ConvertToEuro(15) + ')','Large - 25" (+' + ConvertToEuro(10) + ')', 'Medium - 25" (+' + ConvertToEuro(5) + ')', 'Small - 10" (+' + ConvertToEuro(0) + ')']; // Initialise sizes

        data.forEach(product => { // Loop through each product retrieved
            // Assign column to grid
            let productCol = document.createElement('div')
            productCol.setAttribute('class','col');

            // Create card
            let productCard = document.createElement('div');
            productCard.setAttribute('class','card mx-auto h-100');
            productCard.setAttribute('style','width: 27em');
            
            // Create card body element
            let cardBody = document.createElement('div');
            cardBody.setAttribute('class','card-body');

            // Create product image
            let productImage = document.createElement('img');
            productImage.setAttribute('class','card-img');
            productImage.setAttribute('src','images/placeholderFood.jpg');

            // Create product header (price and name)
            let productName = document.createElement('div');
            productName.setAttribute('class','card-header');
            productName.textContent = product.product_name + ' - ' + ConvertToEuro(product.product_price);

            // Create product description
            let productDesc = document.createElement('p');
            productDesc.setAttribute('class','card-text');
            productDesc.setAttribute('style','margin-top: 0.5em;');
            productDesc.textContent = product.description;

            // Create ingredients header
            let productIngredientsHeader = document.createElement('h6');
            productIngredientsHeader.setAttribute('class','card-text');
            productIngredientsHeader.setAttribute('style','font-weight: 600');
            productIngredientsHeader.textContent = "Ingredients:";

            // List ingredients
            let productIngredients = document.createElement('p');
            productIngredients.setAttribute('class','card-text text-secondary');
            productIngredients.textContent = product.ingredients;

            // Create product footer
            let productAddFooter = document.createElement('div');
            productAddFooter.setAttribute('class','card-footer');
            productAddFooter.setAttribute('style','background-color: #dc3545;');
            
            // Create product size select box
            let productSizeSelect = document.createElement('select');
            productSizeSelect.setAttribute('class','form-select form-select-lg sizeSelect');
            productSizeSelect.setAttribute('style','width: 10em; height: 3em; float: left;');
            for (let i = 0; i < sizes.length; i++)
            {
                let size = document.createElement('option');
                size.setAttribute('style','background-color:white; color:black');
                size.textContent = sizes[i];
                productSizeSelect.appendChild(size);
            }
            productAddFooter.appendChild(productSizeSelect); // Append to footer

            let productAddButton = document.createElement('button');
            productAddButton.setAttribute('class','btn btn-light')
            productAddButton.setAttribute('style','width: 10em; height: 3.75em; float: right; font-weight:800;')
            productAddButton.textContent = "Add to Cart";
            productAddButton.setAttribute('onclick',"AddToCart(this)");
            productAddFooter.appendChild(productAddButton); // Append to footer

            // Append elements to create card
            productCol.appendChild(productCard);
            productCard.appendChild(productName);
            cardBody.appendChild(productImage);
            cardBody.appendChild(productDesc);
            cardBody.appendChild(productIngredientsHeader);
            cardBody.appendChild(productIngredients);
            productCard.appendChild(cardBody);
            productCard.appendChild(productAddFooter);

            outputSection.appendChild(productCol); // Append to output
        });
    }
        catch(error)
        {
        console.log(error.message);
        }
}

function AddToCart(value)
{
    // Get clicked Product
    let clickedCard = value.parentElement.parentElement;

    // Get card elements
    let CardHeader = clickedCard.children[0];
    let CardBody = clickedCard.children[1];
    let CardFooter = clickedCard.children[2];

    // Assign product values by getting info off clicked card values
    let AddedProductName = CardHeader.innerHTML.split(' -')[0];
    let AddedProductIngredients = CardBody.children[3].innerHTML;
    let AddedProductSelectedValue = CardFooter.getElementsByClassName('sizeSelect')[0].value;
    let AddedProductSize = AddedProductSelectedValue.split(' ')[0];
    let AddedProductSizePrice = AddedProductSelectedValue.split('+')[1].slice(1,-1);
    let AddedProductBasePrice = CardHeader.innerHTML.split('- ')[1].substring(1);
    let AddedProductPrice = +AddedProductSizePrice + +AddedProductBasePrice;

    let currentCartData = JSON.parse(localStorage.getItem('CartData')); // Get current cart

    if (Object.values(currentCartData.products) == null || Object.values(currentCartData.products).length == 0) // When array is empty, products becomes an object, not an empty array again. This statement avoids that
    {
        currentCartData.products = [];
    }
    currentCartData.products.push( {'name': AddedProductName, 'ingredients': AddedProductIngredients, 'size' : AddedProductSize, 'price': AddedProductPrice} ); // Add product to current cart
    currentCartData.total += AddedProductPrice; // Update price total

    localStorage.setItem('CartData', JSON.stringify(currentCartData)); // Update cart with new info

    UpdateDisplayCart(); // Update cart visually

}

function UpdateDisplayCart()
{
    // Clear Cart
    let cartElement = document.getElementById('cart');
    cartElement.innerHTML = ''; 
    
    // Populate Cart
    let currentCartData = JSON.parse(localStorage.getItem('CartData')); 

    if (Object.values(currentCartData.products) == null || Object.values(currentCartData.products).length == 0) // If cart is empty
    {
        cartElement.innerHTML = 'Add to Cart!'; 
        document.getElementById('CartCounter').innerHTML = 0;
    }
    else
    {
    let products = Object.values(currentCartData.products);

        for(let i = 0; i < products.length; i++)
        {   
            if (products[i] == null)
            {
                console.log('null item in cart'); // If null item in cart, shouldn't happen but just in case item didn't delete from cart properly
            }
            else
            {
                // Create Divider Template
                let cartDivider = document.createElement('li');
                let dividerInner = document.createElement('hr');
                dividerInner.setAttribute('class','dropdown-divider');
                cartDivider.appendChild(dividerInner);

                // Create list item element
                let product = products[i];
                let productListItem = document.createElement('li');
                productListItem.setAttribute('style', 'width: 20em;')

                // Create collapse menu element
                let productHeader = document.createElement('a');
                productHeader.setAttribute('class','dropdown-item');
                productHeader.setAttribute('style','width: 15em; float: left; margin-right: 0;');
                productHeader.setAttribute('data-bs-toggle','collapse');
                productHeader.setAttribute('href','#collapseProduct' + i);
                productHeader.setAttribute('role','button');
                productHeader.setAttribute('aria-expanded','false');
                productHeader.setAttribute('aria-controls','collapseProduct' + i);
                productHeader.innerHTML = product.name + ' (' + product.size + ')' + ' - ' + ConvertToEuro(product.price);

                // Create remove button element
                let productRemove = document.createElement('button');
                productRemove.setAttribute('class', 'btn btn-outline-danger');
                productRemove.setAttribute('style','margin-left: 1em; width: 4em; float; right;');
                productRemove.setAttribute('onclick','BinProduct(this)');
                let removeImg = document.createElement('img');
                removeImg.setAttribute('src','images/bin.webp');
                removeImg.setAttribute('style','height: 1em');
                productRemove.appendChild(removeImg);

                // Create ingredients for collapse menu
                let productIngredientsOutput = document.createElement('p');
                productIngredientsOutput.setAttribute('class','collapse text-body-tertiary');    
                productIngredientsOutput.setAttribute('id','collapseProduct' + i);    
                productIngredientsOutput.setAttribute('style','clear: both');    

                let productIngredients = product.ingredients.split(', ');
                for (let i = 0; i < productIngredients.length; i++) // list each product on a new line
                {
                    let productIngredient = document.createElement('p');
                    productIngredient.setAttribute('style','margin-left: 2em; font-size: .75em;');
            
                    productIngredient.innerHTML = '- ' + productIngredients[i];
                    productIngredientsOutput.appendChild(productIngredient);
                    
                }

                // Append new elements to display cart
                productListItem.appendChild(productHeader);
                productListItem.appendChild(productRemove);
                productListItem.appendChild(productIngredientsOutput);
                cartElement.appendChild(productListItem);
                cartElement.appendChild(cartDivider);
            }
        }

        // Display Total
        let totalDisplay = document.createElement('li');
        totalDisplay.setAttribute('class','dropdown-item');
        totalDisplay.setAttribute('style','text-align:center; font-weight:bold');
        totalDisplay.innerHTML = 'Total : ' + ConvertToEuro(currentCartData.total);

        cartElement.appendChild(totalDisplay);

        //  Create Checkout Button
        let buttonListItem = document.createElement('li');
        buttonListItem.setAttribute('class','dropdown-item');
        buttonListItem.setAttribute('style','text-align:center;')

        let checkoutButton = document.createElement('a');  
        checkoutButton.setAttribute('class','btn btn-danger');
        checkoutButton.setAttribute('role','button');
        checkoutButton.setAttribute('onclick','Checkout()');
        checkoutButton.setAttribute('style','width:10em; border-radius: 15px');
        checkoutButton.innerHTML = 'Checkout';

        buttonListItem.appendChild(checkoutButton);
        cartElement.appendChild(buttonListItem);

        // Update Counter
        document.getElementById('CartCounter').innerHTML = products.length;
    }
}

function ConvertToEuro(value)
{
    let price = value.toLocaleString('en-IE', {
        style: 'currency',
        currency: 'EUR',});

        return price;
}

function Checkout()
{
    // Check if loggeed in
    if (localStorage.getItem('LoggedUser') === 'Guest')
    {
        alert('Please log in or create an account before entering checkout')
    }
    else
    {
        window.open('checkout.html','_self'); // change current loaction to checkout if logged in
    }
}

function BinProduct(value)
{
    let currentCartData = JSON.parse(localStorage.getItem('CartData'));

    let selectedListItem = value.parentElement;
    let list = selectedListItem.parentElement;
    let itemIndex = selectedListItem.children[0].href.split('collapseProduct')[1];

    // Remove price from total
    let product = currentCartData.products[itemIndex];
    let productPrice = currentCartData.products[itemIndex].price;
    currentCartData.total -= productPrice;

    // Delete from cart data
    currentCartData.products.splice(itemIndex,1); 

    if (Object.values(currentCartData.products) == null || Object.values(currentCartData.products).length == 0) // when array is empty, products becomes an object, not an empty array again. This statement avoids that
    {
        currentCartData.products = [];
    }

    localStorage.setItem('CartData', JSON.stringify(currentCartData));

    // Delete from cart list
    list.removeChild(selectedListItem);

    UpdateDisplayCart() // Update cart visually

}

function ClearCart()
{
    // Clear Cart
    let cartElement = document.getElementById('cart');
    cartElement.innerHTML = ''; 

    // Clear Cart Data
    const CartData = 
    {
        'products': [],
        'total' : 0
    };
    localStorage.setItem('CartData', JSON.stringify(CartData));
}

function CheckEircode()
{
    let url = window.location.href // get url

    if (url.includes("Eircode=")) // if url has eircode (from index submit)
    {
        let unformattedEircode = url.split("Eircode=")[1];
        if (unformattedEircode == "")
        {
            localStorage.setItem('Eircode', "")
            console.log("No Eircode");
        }
        else
        {
            let eircodeP1 = unformattedEircode.split("+")[0];
            let eircodeP2 = unformattedEircode.split('+')[1];
            let eircode = eircodeP1 + " " + eircodeP2;
            console.log(eircode);
            localStorage.setItem('Eircode', eircode);
        }
        
    }
    else if (localStorage.getItem('Eircode') === null) // if no eircode set empty
    {
        localStorage.setItem('Eircode', "");
        console.log("No Eircode");
    }
    else
    {
        console.log(localStorage.getItem('Eircode') + "No Eircode");
    }
}

