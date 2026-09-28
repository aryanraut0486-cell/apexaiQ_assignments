function createCounter() {

    let count = 0;

    function increment() {
        count++;
        return count;
    }

    return increment;
}

const counter = createCounter();

console.log(counter());
console.log(counter());
console.log(counter());

function createUser() {

    let username = "Aryan";

    return function() {
        return username;
    };
}

const user = createUser();

console.log(user());