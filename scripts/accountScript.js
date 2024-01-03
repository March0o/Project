(function() 
{
    // Initilize Account data  
    if (localStorage.getItem('AccountData') === null) 
    {
        let AccountData = 
        {
            'users': []
        };
        AccountData.users.push( {'first_name': 'testPerson', 'last_name' : 'testLastName', 'email':'test@email.com','password':'test','card_details':''} );
        localStorage.setItem('AccountData', JSON.stringify(AccountData));

        console.log(AccountData);
    }
    else
    {
        console.log(JSON.parse(localStorage.getItem('AccountData')));
    }

    // Determine if logged in
    if (localStorage.getItem('LoggedUser') === null)
    {
        let loggedUser = 'Guest';
        localStorage.setItem('LoggedUser', loggedUser);
        console.log('New Guest');
    }
    else if (localStorage.getItem('LoggedUser') === 'Guest')
    {
        console.log('Guest');
    }
    else
    {
        console.log(JSON.parse(localStorage.getItem('LoggedUser')));
        ChangeDisplay();
    }

})();

function SignIn()
{
    let detailsForm = document.getElementById('SignIn/UserInfo');

    let emailInput = detailsForm.children[0].children[0].value;
    let passwordInput = detailsForm.children[1].children[0].value;

    let AccountData = JSON.parse(localStorage.getItem('AccountData'));
    let userFound = false

    for (let i = 0; i < Object.values(AccountData.users).length; i ++)
    {
        if (AccountData.users[i].email == emailInput && AccountData.users[i].password == passwordInput)
        {
            console.log('User Found');
            userFound = true;
            
            localStorage.setItem('LoggedUser', JSON.stringify(AccountData.users[i]));
            location.reload();
        }
        break;
    }

    if (userFound == false)
    {
        console.log('User Not Found');

        let alertDiv = document.getElementById('SignInAlertDiv');
        alertDiv.setAttribute('class','alert alert-danger');
        alertDiv.setAttribute('role','alert');
        alertDiv.setAttribute('style','margin-top: 1em;')
        alertDiv.innerHTML = "No user found with these credentials, please enter info again";
    }

    console.log('worked-ish');
}

function ChangeDisplay()
{
    let user = JSON.parse(localStorage.getItem('LoggedUser'));

    // Sign Out Button Re-Assign
    let signOutBtn = document.getElementById('Register/SignOut');
    signOutBtn.innerHTML = 'Sign Out';
    signOutBtn.setAttribute('href','index.html');
    signOutBtn.setAttribute('onclick','SignOut()');

    // Dropdown Re-Assign
    let UserInfoBtn = document.getElementById('SignIn/UserInfoBtn');
    UserInfoBtn.innerHTML = 'User Information';

    let UserInfoForm = document.getElementById('SignIn/UserInfo');
    UserInfoForm.innerHTML = "";
    let infoKeys = 
    [
        "First Name",
        "Last Name",
        "E-mail",
        "Password",
        "Saved Card"
    ]
    let infoValues = Object.values(user);
    for (let i = 0; i < infoKeys.length; i++)
    {
        // Create info Div
        let infoDiv = document.createElement('div');
        let infoLabel = document.createElement('label');
        let infoField = document.createElement('input');

        infoLabel.setAttribute('class','form-label');
        infoField.setAttribute('class','form-control-plaintext')
        infoLabel.innerHTML = infoKeys[i];

        if (i == infoKeys.length - 1)
        {
            if (infoValues[i] == "")
            {
                infoField.value = "None";
            }
            else
            {
            let cNumber = infoValues[i].split("/")[1];
            infoField.value = "Card Ending in " + cNumber.substr(cNumber.length - 4);
            }
        }
        else
        {
            infoField.value = infoValues[i];
        }
        infoDiv.appendChild(infoLabel);
        infoDiv.appendChild(infoField);

        UserInfoForm.appendChild(infoDiv);
    }
        
}


function SignOut()
{
    let loggedUser = 'Guest';
    localStorage.setItem('LoggedUser', loggedUser);
    console.log('New Guest');
}
