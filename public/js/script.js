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
        .then(response => response.json())
        .then(result => alert(result.message));

}

function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const error = document.getElementsByClassName("errormsg");
    error[0].style.display = "none";
    error[1].style.display = "none";
    if (email === "" && password === "") {
        error[0].style.display = "block";
        error[1].style.display = "block";

    } else if (email === "") {
        error[0].style.display = "block";
        error[1].style.display = "none";

    } else if (password === "") {
        error[0].style.display = "none";
        error[1].style.display = "block";

    } else {
        error[0].style.display = "none";
        error[1].style.display = "none";
        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email:email, password:password })
        })
            .then(response => response.json())
            .then(result => {
                if (result === "LOGIN_SUCCESS") {

                    window.location.href = "../html/dashboard.html";
                } else {
                    setTimeout(()=>{
                        error[1].textContent = "Invalid password for the given email";
                    error[1].style.display = "block";
                    },1000);
                    
                }
            })
            .catch(error=>console.log("Error:",error));
    }
}
document.getElementById("loginpage").addEventListener("click", function () {
    this.getElementsByClassName("emailin")[0].value = "";
    this.getElementsByClassName("passwordlogin")[0].value = "";
});

function forgotPassword() {
    const loginbox = document.querySelector(".login-container");
    const frogotbox = document.querySelector(".forgot-container");
    const forgotpage = document.getElementById('forgotpass');
    const loginpage = document.getElementById('loginpage');
    loginbox.classList.add("hide");
    setTimeout(() => {

        forgotpage.style.display = "block";
        loginpage.style.display = "none";
    }, 3000);
    setTimeout(() => {
        frogotbox.classList.add("show");
    }, 3500);
}


function resetpassword() {
    const email = document.getElementById('forgotEmail').value;
    const emailcont = document.getElementsByClassName('emailcontainer');
    const passwordcont = document.getElementsByClassName('passwordcontainer');
    const resetbtn = document.getElementById('resetbtn');
    const errormsg = document.getElementById('errormsg');
    const errormsg2 = document.getElementById('errmsg2');
    const loginbtn1 = document.getElementsByClassName('loginbtn1');
    const loginbtn2 = document.getElementsByClassName('loginbtn2');
    fetch("http://localhost:3000/forgotpass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })
    .then(response=> response.json())
    .then(result=>{
        if (result==="Email Not Found"){
            errmsg.style.display="block";
        } else {
            resetbtn.style.display = 'none';
            emailcont[0].style.display = 'none';
            passwordcont[0].style.display = 'block';
            errormsg.style.display = "none";
            errormsg2.style.display = "none";
            loginbtn1[0].style.display = "none";
            loginbtn2[0].style.display = "block";
        }
    });
    }


function samepassword() {
    const newpass = document.getElementById('forgotPassword');
    const conpass = document.getElementById('confirmforgotPassword');
    const errmsg = document.getElementById("errmsg2");
    const errmsg3 = document.getElementById('errmsg3');
    const loginbtn2 = document.getElementsByClassName('loginbtn2');
    const loginbox = document.querySelector(".login-container");
    const frogotbox = document.querySelector(".forgot-container");
    const email=document.getElementById("forgotemail");
    errmsg.style.display = "none";
    errmsg3.style.display = "none";

    if ((newpass.value.length < 8) || (conpass.value.length < 8)) {
        errmsg3.style.display = "block";
        return;
    }
    if (newpass.value != conpass.value) {
        errmsg.style.display = "block";

    } else {
        loginbtn2[0].textContent = "Resetting...";
        fetch ("http://localhost:3000/setpassword",{
            method: "POST",
            headers: "application: JSON",
            body:{email,newpass}
        })
        .then (response=>response.text())
        .then(result=>{
            if(result==="Password Changed"){
                setTimeout(()=>{
                    loginbox.classList.remove("hide");
                    frogotbox.classList.remove("show");
                },2000);
            } else if (result==="Password is same"){
                errmsg.textContent="Password is same";

            } else if (result==="Something issue in password change"){
                errmsg.textContent("Something issue in password change");
            }
        })
        
    }
}




