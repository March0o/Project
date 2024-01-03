(function() {
    const productJSONUrl = 'https://raw.githubusercontent.com/March0o/JsonProject/main/FoodData.json';
    FetchProducts(productJSONUrl);
    CheckEircode();

    // Shopping Cart Initilize   
    if (localStorage.getItem('CartData') === null) 
    {
        const CartData = 
        {
            'products': [],
            'total' : 0
        };
        localStorage.setItem('CartData', JSON.stringify(CartData));
    }
    
    UpdateDisplayCart();  
})();

async function FetchProducts(url)
{
    try
    {
        const response = await fetch(url);
        if (!response.ok) 
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        const outputSection = document.getElementById('ShopOutput')
        let sizes = ['Ultra - 30" (+' + ConvertToEuro(15) + ')','Large - 25" (+' + ConvertToEuro(10) + ')', 'Medium - 25" (+' + ConvertToEuro(5) + ')', 'Small - 10" (+' + ConvertToEuro(0) + ')'];

        data.forEach(product => {
            let productCol = document.createElement('div')
            productCol.setAttribute('class','col');

            let productCard = document.createElement('div');
            productCard.setAttribute('class','card mx-auto h-100');
            productCard.setAttribute('style','width: 27em');

            let cardBody = document.createElement('div');
            cardBody.setAttribute('class','card-body');

            let productImage = document.createElement('img');
            productImage.setAttribute('class','card-img');
            productImage.setAttribute('src','images/placeholderFood.jpg');

            let productName = document.createElement('div');
            productName.setAttribute('class','card-header');

            productName.textContent = product.product_name + ' - ' + ConvertToEuro(product.product_price);

            let productDesc = document.createElement('p');
            productDesc.setAttribute('class','card-text');
            productDesc.setAttribute('style','margin-top: 0.5em;');
            productDesc.textContent = product.description;

            let productIngredientsHeader = document.createElement('h6');
            productIngredientsHeader.setAttribute('class','card-text');
            productIngredientsHeader.setAttribute('style','font-weight: 600');
            productIngredientsHeader.textContent = "Ingredients:";

            let productIngredients = document.createElement('p');
            productIngredients.setAttribute('class','card-text text-secondary');
            productIngredients.textContent = product.ingredients;

            let productAddFooter = document.createElement('div');
            productAddFooter.setAttribute('class','card-footer');
            productAddFooter.setAttribute('style','background-color: #dc3545;');
            
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
            productAddFooter.appendChild(productSizeSelect);

            let productAddButton = document.createElement('button');
            productAddButton.setAttribute('class','btn btn-light')
            productAddButton.setAttribute('style','width: 10em; height: 3.75em; float: right; font-weight:800;')
            productAddButton.textContent = "Add to Cart";
            productAddButton.setAttribute('onclick',"AddToCart(this)");
            productAddFooter.appendChild(productAddButton);

            productCol.appendChild(productCard);
            productCard.appendChild(productName);
            cardBody.appendChild(productImage);
            cardBody.appendChild(productDesc);
            cardBody.appendChild(productIngredientsHeader);
            cardBody.appendChild(productIngredients);
            productCard.appendChild(cardBody);
            productCard.appendChild(productAddFooter);

            outputSection.appendChild(productCol);
        });
    }
        catch(error)
        {
        console.log(error.message);
        }
}

function AddToCart(value)
{
    let clickedCard = value.parentElement.parentElement;

    let CardHeader = clickedCard.children[0];
    let CardBody = clickedCard.children[1];
    let CardFooter = clickedCard.children[2];

    let AddedProductName = CardHeader.innerHTML.split(' -')[0];
    let AddedProductIngredients = CardBody.children[3].innerHTML;
    let AddedProductSelectedValue = CardFooter.getElementsByClassName('sizeSelect')[0].value;
    let AddedProductSize = AddedProductSelectedValue.split(' ')[0];
    let AddedProductSizePrice = AddedProductSelectedValue.split('+')[1].slice(1,-1);
    let AddedProductBasePrice = CardHeader.innerHTML.split('- ')[1].substring(1);
    let AddedProductPrice = +AddedProductSizePrice + +AddedProductBasePrice;

    let currentCartData = JSON.parse(localStorage.getItem('CartData'));

    if (Object.values(currentCartData.products) == null || Object.values(currentCartData.products).length == 0) // when array is empty, products becomes an object, not an empty array again. This statement avoids that
    {
        currentCartData.products = [];
    }
    currentCartData.products.push( {'name': AddedProductName, 'ingredients': AddedProductIngredients, 'size' : AddedProductSize, 'price': AddedProductPrice} );
    currentCartData.total += AddedProductPrice;

    localStorage.setItem('CartData', JSON.stringify(currentCartData));

    UpdateDisplayCart();

}

function UpdateDisplayCart()
{
    // Clear Cart
    let cartElement = document.getElementById('cart');
    cartElement.innerHTML = ''; 
    
    // Populate Cart
    let currentCartData = JSON.parse(localStorage.getItem('CartData')); 

    if (Object.values(currentCartData.products) == null || Object.values(currentCartData.products).length == 0)
    {
        cartElement.innerHTML = 'Add to Cart!'; 
        document.getElementById('CartCounter').innerHTML = 0;
    }
    else
    {
    let products = Object.values(currentCartData.products);
    let cartTotal = 0;

        for(let i = 0; i < products.length; i++)
        {   
            if (products[i] == null)
            {
                console.log('null item in cart');
            }
            else
            {
                // Create Divider Template
                let cartDivider = document.createElement('li');
                let dividerInner = document.createElement('hr');
                dividerInner.setAttribute('class','dropdown-divider');
                cartDivider.appendChild(dividerInner);

                let product = products[i];
                let productListItem = document.createElement('li');
                productListItem.setAttribute('style', 'width: 20em;')

                let productHeader = document.createElement('a');
                productHeader.setAttribute('class','dropdown-item');
                productHeader.setAttribute('style','width: 15em; float: left; margin-right: 0;');
                productHeader.setAttribute('data-bs-toggle','collapse');
                productHeader.setAttribute('href','#collapseProduct' + i);
                productHeader.setAttribute('role','button');
                productHeader.setAttribute('aria-expanded','false');
                productHeader.setAttribute('aria-controls','collapseProduct' + i);
                productHeader.innerHTML = product.name + ' (' + product.size + ')' + ' - ' + ConvertToEuro(product.price);

                let productRemove = document.createElement('button');
                productRemove.setAttribute('class', 'btn btn-outline-danger');
                productRemove.setAttribute('style','margin-left: 1em; width: 4em; float; right;');
                productRemove.setAttribute('onclick','BinProduct(this)');
                let removeImg = document.createElement('img');
                removeImg.setAttribute('src','images/bin.webp');
                removeImg.setAttribute('style','height: 1em');
                productRemove.appendChild(removeImg);

                let productIngredientsOutput = document.createElement('p');
                productIngredientsOutput.setAttribute('class','collapse text-body-tertiary');    
                productIngredientsOutput.setAttribute('id','collapseProduct' + i);    
                productIngredientsOutput.setAttribute('style','clear: both');    

                let productIngredients = product.ingredients.split(', ');
                for (let i = 0; i < productIngredients.length; i++)
                {
                    let productIngredient = document.createElement('p');
                    productIngredient.setAttribute('style','margin-left: 2em; font-size: .75em;');
            
                    productIngredient.innerHTML = '- ' + productIngredients[i];
                    productIngredientsOutput.appendChild(productIngredient);
                    
                }

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
        // checkoutButton.setAttribute('href','checkout.html');
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

    UpdateDisplayCart() // update cart

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
    let url = window.location.href
    console.log(url);

    if (url.includes("Eircode="))
    {
        let unformattedEircode = url.split("Eircode=")[1];
        let eircodeP1 = unformattedEircode.split("+")[0];
        let eircodeP2 = unformattedEircode.split('+')[1];
        let eircode = eircodeP1 + " " + eircodeP2;
        console.log(eircode);
        localStorage.setItem('Eircode', eircode);
    }
    else if (localStorage.getItem('Eircode') === null)
    {
        localStorage.setItem('Eircode', "");
        console.log("No Eircode");
    }
    else
    {
        console.log(localStorage.getItem('Eircode'));
    }
}

