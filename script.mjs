function registeruser() {
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("register button clicked");
fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
    })
})
.then(response => response.text())
.then(result => alert(result));

}

function login() {

    const email=document.getElementById("email").value;
    const password= document.getElementById("password").value;
    const error=document.getElementsByClassName("errormsg");
    error[0].style.display="none";
    error[1].style.display="none";
    if (email === "" && password === "") {
        error[0].style.display="block";
        error[1].style.display="block";
        
    } else if (email === "") {
        error[0].style.display="block";
        error[1].style.display="none";
        
    } else if  (password === ""){
        error[0].style.display="none";
        error[1].style.display="block";
        
    } else{
        error[0].style.display="none";
        error[1].style.display="none";
    fetch("http://localhost:3000/login",{
        method: "POST",
        headers :{"Content-Type" : "application/json"},
        body: JSON.stringify({email,password})
    })
    .then(response => response.text())
    .then(result => {
        if(result === "LOGIN_SUCCESS"){
            
            window.location.href = "dashboard.html";
        } else {
            error[1].textContent="Invalid password for the given email";
            error[1].style.display="block";
        }
});
}
}
document.getElementById("logpage").addEventListener("click", function() {
    this.getElementsByClassName("emailin")[0].value="";
    this.getElementsByClassName("passwordlogin")[0].value="";
});

function forgotpassword() {
    window.location.href = "forgotpass.html";
    const email=document.getElementById("email").value;
    fetch("http://localhost:3000/forgot-password",{

})
}