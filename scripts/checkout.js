(function() 
{
    PopulateCartCard();
    AutofillFields();
})();

function PopulateCartCard()
{
    let cardBody = document.getElementById('cartCardBody');

    // Create List Element
    let productList = document.createElement('ul');
    productList.setAttribute('class','list-group list-group-flush');
    productList.setAttribute('style','height:13em; overflow-y: scroll;')

    // Populate Cart
    let currentCartData = JSON.parse(localStorage.getItem('CartData')); 

    if (Object.values(currentCartData.products) == null || Object.values(currentCartData.products).length == 0)
    {
        cardBody.innerHTML = 'Nothing in Cart'; 
    }
    else
    {
    let products = Object.values(currentCartData.products);

        for(let i = 0; i < products.length; i++)
        {   
            if (products[i] == null)
            {
                console.log('null item in cart');
            }
            else
            {
                let product = products[i];

                let productHeader = document.createElement('a');
                productHeader.setAttribute('class','list-group-item list-group-item-action');
                productHeader.setAttribute('data-bs-toggle','collapse');
                productHeader.setAttribute('href','#collapseProduct' + i);
                productHeader.setAttribute('role','button');
                productHeader.setAttribute('aria-expanded','false');
                productHeader.setAttribute('aria-controls','collapseProduct' + i);
                productHeader.innerHTML = product.name + ' (' + product.size + ')' + ' - ' + ConvertToEuro(product.price);

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

                productList.appendChild(productHeader);
                productList.appendChild(productIngredientsOutput);

            }
        }

        cardBody.appendChild(productList);

        // Display Total
        let cartFooter = document.getElementById('cartFooter');

        let totalDisplay = document.createElement('li');
        totalDisplay.setAttribute('class','dropdown-item');
        totalDisplay.setAttribute('style','text-align:center; font-weight:bold');
        totalDisplay.innerHTML = 'Total : ' + ConvertToEuro(currentCartData.total);

        cartFooter.appendChild(totalDisplay);

    }
}

function AutofillFields()
{
    // Get data to fill in
    let eircode = localStorage.getItem('Eircode');
    let user = JSON.parse(localStorage.getItem('LoggedUser'));

    // Get input elements
    let firstNameInput = document.getElementById('fNameInput');
    let lastNameInput = document.getElementById('lNameInput');
    let emailInput = document.getElementById('emailInput');
    let eircodeInput = document.getElementById('eircodeInput');

    let cardholderName = document.getElementById('cNameInput');
    let cardNumber = document.getElementById('cNumberInput');
    let cardExpiry = document.getElementById('expiryInput');
    let cardCcv = document.getElementById('cvvInput');

    // Autofill values
    firstNameInput.value = user.first_name;
    lastNameInput.value = user.last_name;
    emailInput.value = user.email;

    if (eircode == undefined)
    {
        eircodeInput.value = "";
    }
    else
    {
        eircodeInput.value = eircode;
    }

    if (user.card_details != "") // if Card is saved, Populate
    {
        cardholderName.value = user.card_details.split("/")[0];
        cardNumber.value = user.card_details.split("/")[1];
        cardExpiry.value = user.card_details.split("/")[2] + "/" + user.card_details.split("/")[3];
        cardCcv.value = user.card_details.split("/")[4];
    }

}

function SaveCard()
{
    let checkbox = document.getElementById('saveCardCheck');

    if (checkbox.checked == true)
    {
        let cardholder = document.getElementById('cNameInput').value;
        let cardnumber = document.getElementById('cNumberInput').value;
        let expiry = document.getElementById('expiryInput').value;
        let cvv = document.getElementById('cvvInput').value;

        let user = JSON.parse(localStorage.getItem('LoggedUser'));
        let userList  = JSON.parse(localStorage.getItem('AccountData'));
        let cardDetails = cardholder + '/' + cardnumber + '/' + expiry + '/' + cvv;

        user.card_details = cardDetails;

        for (let i = 0; i < Object.values(userList.users).length; i++ )
        {
            if (userList.users[i].email == user.email)
            {
                userList.users[i].card_details = cardDetails;
            }
        }

        localStorage.setItem('LoggedUser',JSON.stringify(user));
        localStorage.setItem('AccountData',JSON.stringify(userList));
    }
}