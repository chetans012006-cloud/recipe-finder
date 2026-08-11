async function sendResetLink(){


let email =
document.getElementById("email").value;


let message =
document.getElementById("message");



if(!email){

    message.innerHTML =
    "Please enter email";

    return;

}



try{


let response = await fetch(

"https://recipe-finder-gdak.onrender.com/api/api/users/forgot-password",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email:email

})

}

);



let data =
await response.json();



if(response.ok){


message.innerHTML =
"✅ Reset link sent to your email";


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