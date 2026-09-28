const promise = new Promise(function(resolve, reject) {

    let success = true;

    setTimeout(function() {

        if (success) {
            resolve("Operation successful");
        } else {
            reject("Operation failed");
        }

    }, 2000);
});

promise
    .then(function(result) {
        console.log(result);
        return "First operation completed";
    })
    .then(function(result) {
        console.log(result);
        return "Second operation completed";
    })
    .catch(function(error) {
        console.log(error);
    });