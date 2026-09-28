const button = document.getElementById("button");

button.onclick = function() {
    console.log("Button clicked");
};

button.onmouseover = function() {
    console.log("Mouse over button");
};

document.onkeydown = function() {
    console.log("Key pressed");
};

document.onkeyup = function() {
    console.log("Key released");
};

document.getElementById("form").onsubmit = function(event) {
    event.preventDefault();
    console.log("Form submitted");
};

document.getElementById("input").onchange = function() {
    console.log("Input changed");
};
