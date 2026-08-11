let users = JSON.parse(
    localStorage.getItem("users")
) || [];


// Create new user

function createUser(username,email,password,profilePic){

    let user = {

        id: "U" + Date.now(),

        username: username,

        email: email,

        password: password,

        profilePic: profilePic || "images/default-profile.png"

    };


    users.push(user);


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    return user;

}

function loginUser(email,password){


let users =
JSON.parse(localStorage.getItem("users")) || [];


let user = users.find(

u => 
u.email === email &&
u.password === password

);


if(user){

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );


    return user;

}


alert("Invalid email or password");


return null;


}