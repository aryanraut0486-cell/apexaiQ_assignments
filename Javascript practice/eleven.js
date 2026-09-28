function greet(name, callback) {
    let message = "Hello " + name;
    callback(message);
}

greet("Aryan", function(message) {
    console.log(message);
});

function calculate(a, b, operation) {
    return operation(a, b);
}

let addition = calculate(10, 5, function(a, b) {
    return a + b;
});

let multiplication = calculate(10, 5, function(a, b) {
    return a * b;
});

console.log(addition);
console.log(multiplication);

function getData(callback) {
    setTimeout(function() {
        callback("Data received");
    }, 2000);
}

getData(function(data) {
    console.log(data);
});