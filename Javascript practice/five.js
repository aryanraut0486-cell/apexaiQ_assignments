let globalValue = "Global";

function add(a, b) {
    let result = a + b;
    return result;
}

function greet(name) {
    return "Hello " + name;
}

let result = add(10, 20);

console.log(result);
console.log(greet("Aryan"));
console.log(globalValue);

{
    let blockValue = "Block";
    console.log(blockValue);
}