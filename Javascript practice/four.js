let age = 20;

if (age >= 18) {
    console.log("Adult");
} else {
    console.log("Minor");
}

let marks = 75;

if (marks >= 90) {
    console.log("A+");
} else if (marks >= 75) {
    console.log("A");
} else if (marks >= 60) {
    console.log("B");
} else {
    console.log("Fail");
}

let day = 2;

switch (day) {
    case 1:
        console.log("Monday");
        break;
    case 2:
        console.log("Tuesday");
        break;
    case 3:
        console.log("Wednesday");
        break;
    default:
        console.log("Invalid");
}

for (let i = 1; i <= 5; i++) {
    console.log(i);
}

let student = {
    name: "Aryan",
    age: 20,
    branch: "IT"
};

for (let key in student) {
    console.log(key, student[key]);
}

let subjects = ["Java", "Python", "JavaScript"];

for (let subject of subjects) {
    console.log(subject);
}

let i = 1;

while (i <= 5) {
    console.log(i);
    i++;
}

let j = 1;

do {
    console.log(j);
    j++;
} while (j <= 5);