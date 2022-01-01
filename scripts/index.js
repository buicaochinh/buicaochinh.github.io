/**
 * Typewriter Effect for Greeting!
*/
var quoteArray = ["Hello. I'm Chinh! Welcome to my page ❤️!"];
var textPosition = 0;
var speed = 100;

const typewriter = () => {
    document.querySelector("#message").innerHTML = quoteArray[0].substring(0, textPosition) + '<span id="cursor">|</span>';

    if (textPosition++ != quoteArray[0].length)
        setTimeout(typewriter, speed);
}

window.addEventListener("load", typewriter)
