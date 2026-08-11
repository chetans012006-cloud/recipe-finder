async function resetPassword(){
console.log(window.location.href);

let password =
document.getElementById("password").value;


let confirmPassword =
document.getElementById("confirmPassword").value;



let message =
document.getElementById("message");



if(password !== confirmPassword){

    message.innerHTML =
    "Passwords do not match";

    return;

}



let params =
new URLSearchParams(
window.location.search
);



let token =
params.get("token");



if(!token){

    message.innerHTML =
    "Invalid reset link";

    return;

}

console.log("Sending reset request");
console.log(token);
console.log(password);

try{


let response = await fetch(

"https://recipe-finder-gdak.onrender.com/api/users/reset-password",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

token:token,

password:password

})

}

);



let data =
await response.json();



if(response.ok){


message.innerHTML =
"✅ Password reset successful";


setTimeout(()=>{

window.location.href="login.html";

},2000);


}

else{


message.innerHTML =
data.message;


}



}

catch(error){

console.log(error);


message.innerHTML =
"Server error";

}


}