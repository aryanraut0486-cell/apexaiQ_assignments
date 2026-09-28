let numbers = [1, 2, 3, 4, 5];

console.log(numbers.length);

numbers.push(6);
console.log(numbers);

numbers.pop();
console.log(numbers);

numbers.shift();
console.log(numbers);

numbers.unshift(1);
console.log(numbers);

let doubled = numbers.map(function(number) {
    return number * 2;
});

let even = numbers.filter(function(number) {
    return number % 2 === 0;
});

let total = numbers.reduce(function(sum, number) {
    return sum + number;
}, 0);

console.log(doubled);
console.log(even);
console.log(total);

let mixed = [
    10,
    "JavaScript",
    true,
    { name: "Aryan" },
    function() {
        return "Hello";
    }
];

console.log(mixed);