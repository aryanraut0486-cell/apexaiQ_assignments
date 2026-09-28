let student = {
    name: "Aryan",
    age: 20,
    branch: "IT",
    subjects: ["Java", "Python"],
    address: {
        city: "Nanded",
        country: "India"
    },

    introduce: function() {
        return "My name is " + this.name;
    }
};

console.log(student.name);
console.log(student["age"]);

student.college = "ABC College";

student.age = 21;

delete student.college;

console.log(student.introduce());

console.log(Object.keys(student));
console.log(Object.values(student));
console.log(Object.entries(student));

console.log(student.address.city);