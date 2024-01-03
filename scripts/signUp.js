function RegisterAccount(form)
{
    console.log(form);
    
    // Assign input values
    let fName = form.children[0].children[0].children[1].value;
    let lName = form.children[0].children[1].children[1].value;
    let email = form.children[1].children[1].value;
    let password = form.children[2].children[1].value;

    // Append new user to data
    let currentAccountData = JSON.parse(localStorage.getItem('AccountData'));
    let newUser = {'first_name': fName, 'last_name' : lName, 'email': email,'password': password, "card_details":""};
    currentAccountData.users.push(newUser);
    localStorage.setItem('AccountData', JSON.stringify(currentAccountData));

    // Log new User in
    localStorage.setItem('LoggedUser', JSON.stringify(newUser));
}