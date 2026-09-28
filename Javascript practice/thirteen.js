function getData() {
    return new Promise(function(resolve, reject) {

        let success = true;

        setTimeout(function() {

            if (success) {
                resolve("Data received");
            } else {
                reject("Data failed");
            }

        }, 2000);
    });
}

async function fetchData() {

    try {

        let result = await getData();

        console.log(result);

    } catch (error) {

        console.log(error);

    }
}

fetchData();