function ChangePassword()
{
    let inputEmail = document.getElementById('InputEmail').value;
    let inputNewPassword = document.getElementById('InputPassword').value;

    let data = JSON.parse(localStorage.getItem('AccountData'));

    for (let i = 0; i < Object.values(data.users).length; i++)
    {
        if (data.users[i].email == inputEmail)
        {
            data.users[i].password = inputNewPassword;
            alert('Password Changed to' + inputNewPassword);
        }
    }

    localStorage.setItem('AccountData',JSON.stringify(data));
}