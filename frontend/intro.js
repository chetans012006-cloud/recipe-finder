const introSound =
document.getElementById("introSound");

const whooshSound =
document.getElementById("whooshSound");
import {
  lerp,
  getPointsForGridId,
  getEdgeIdsForGridId,
  getPointID,
  hash,
  smoothstep
} from "https://codepen.io/shubniggurath/pen/OPyPdmm.js";

let fullCode = "Recipe Finder";
let letterParticles = [];
let exploded = false;
let swipeDirection = 1;
let transitionStarted = false;
let stretchAmount = 0;
let stretching = false;

let animationStarted = false;
const container = document.getElementById("container");
const logoIcon = document.getElementById("logoIcon");
const CONFIG = {

    awidth: Math.min(400, window.innerWidth - 100),
    aheight: Math.min(400, window.innerHeight - 100),

    gridW: 25,
    gridH: 8,

    gravity:0.2,
    damping:0.99,

    iterationsPerFrame:5,

};


CONFIG.cellWidth =
CONFIG.awidth/(CONFIG.gridW-1);


CONFIG.cellHeight =
CONFIG.aheight/(CONFIG.gridH-1);



let c;
let ctx;

function explodeLetters(){
    stretching = true;
whooshSound.volume = 0.4;

whooshSound.currentTime = 0;

whooshSound.play()
.catch(()=>{});

    exploded = true;


    letterParticles.forEach(letter=>{


        letter.pinned = false;


        let force =
        Math.random()*20 + 10;


        letter.oldX =
        letter.x - (force * swipeDirection);


        letter.oldY =
        letter.y - (Math.random()*20-10);


    });
setTimeout(()=>{

    showHomepage();

},1500);

}
function showHomepage() {

    const intro = document.getElementById("introAnimation");
    const website = document.getElementById("mainWebsite");

    // Fade out intro
    intro.style.transform = "scale(1.3)";
    intro.style.opacity = "0";

    setTimeout(() => {

        // Completely remove intro
        intro.style.display = "none";

        // NOW show main website
        website.style.display = "block";

        setTimeout(() => {
            website.style.opacity = "1";
            website.style.transform = "translateY(0)";
        }, 50);

        document.body.classList.remove("intro-active");

    }, 1000);
}
function drawTagline(){

    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(255,255,255,0.7)";

    ctx.font = "24px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "Find. Cook. Enjoy.",
        c.width/2,
        c.height/2 + 80
    );

}
function startAnimation(){
    


    c = document.createElement("canvas");


    container.innerHTML="";


    container.appendChild(c);



    c.width = window.innerWidth;

    c.height = window.innerHeight;



    ctx = c.getContext("2d");



    ctx.fillStyle="white";

    ctx.font="bold 80px Arial";

    ctx.textAlign="center";

    ctx.textBaseline="middle";



    let letters = fullCode.split("");

let spacing = 70;


let totalWidth =
(fullCode.length - 1) * spacing;


let startX =
(c.width - totalWidth) / 2;


letters.forEach((letter,index)=>{


    let x = startX + index * spacing;
    let y = c.height/2;


    let particle = {

    char: letter,

    x:x,

    y:y,

    oldX:x,

    oldY:y,

    pinned:true,

    opacity:1
    

};


letterParticles.push(particle);


});



function animate(){

    updateLetters();

    applyGravity();

    drawLetters();

drawTagline();

requestAnimationFrame(animate);

}


animate();


}

function updateLetters(){
    if(stretching){

    stretchAmount += 2;

}

    letterParticles.forEach(letter=>{


        if(letter.pinned) return;


        let velocityX =
        letter.x - letter.oldX;


        let velocityY =
        letter.y - letter.oldY;


        letter.oldX = letter.x;
        letter.oldY = letter.y;


        letter.x += velocityX;

        letter.y += velocityY + 0.5;

if(exploded){

    letter.opacity -= 0.01;

}
    });


}
function applyGravity(){

    letterParticles.forEach(letter=>{


        if(letter.pinned) return;


        letter.oldY = letter.y;


        letter.y += 3;


    });

}
function drawLetters(){


    ctx.clearRect(
        0,
        0,
        c.width,
        c.height
    );


    ctx.fillStyle="white";

    ctx.font="bold 80px Arial";

    ctx.textAlign="center";

    ctx.textBaseline="middle";



    letterParticles.forEach(letter=>{


    ctx.globalAlpha = letter.opacity;


    ctx.fillText(

        letter.char,

        letter.x + 
(letterParticles.indexOf(letter)-6)*stretchAmount,

letter.y

    );


});


ctx.globalAlpha = 1;


}

startAnimation();
let startTouchX = 0;
let startTouchY = 0;

window.addEventListener("pointerdown", (e) => {

    if (!transitionStarted) {

        introSound.volume = 0.3;
        introSound.currentTime = 0;

        introSound.play().catch(() => {});

        transitionStarted = true;
    }

    startTouchX = e.clientX;
    startTouchY = e.clientY;

}, { passive: true });


window.addEventListener("pointerup", (e) => {

    if (transitionStarted === false) {
        return;
    }

    let distanceX = e.clientX - startTouchX;
    let distanceY = e.clientY - startTouchY;

    // Make sure it is mainly a horizontal swipe
    if (
        Math.abs(distanceX) > 80 &&
        Math.abs(distanceX) > Math.abs(distanceY)
    ) {

        swipeDirection =
            distanceX > 0 ? 1 : -1;

        explodeLetters();
    }

});


window.addEventListener("pointerdown", function(e) {

    if (e.pointerType === "touch") return;

    if (exploded) return;

    startTouchX = e.clientX;

});


window.addEventListener("pointerup", function(e) {

    if (e.pointerType === "touch") return;

    if (exploded) return;

    let distance =
        e.clientX - startTouchX;

    if (Math.abs(distance) > 100) {

        swipeDirection =
            distance > 0 ? 1 : -1;

        explodeLetters();

    }

});