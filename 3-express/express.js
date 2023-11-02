'use strict';

// Core Module Import
import fs from 'fs'; // file system manager
import http from 'http'; // HTTP module for creating an HTTP server
import url from 'url'; // URL module for parsing request URLs

// Express Module Import
import express from 'express'; // import express module with ES6 syntax
const app = express(); // define app as express() function
const PORT = 3000; // Define port for the user to use

// File Path
const petsPath = '../pets.json'; // define path to pets
const petRegExp = /^\/pets\/(\d+)$/; // Define a regular expression to match paths like '/pets/:index'
let pets = undefined; // initialize variable to store pet data

// MAIN FUNCTION
function main() {
    console.log('SERVER IS RUNNING'); // Console log message
    app.get('/pets', (req, res) => {
        // Handle GET request for '/pets' here
    });

    // Import Pets from the database (JSON file)
    function importPets() {
        const data = fs.readFileSync(petsPath, 'utf8'); // grab the pets.json file and read
        pets = JSON.parse(data); // set pets variable to parsed data
        console.log(pets);
    }

    

    app.listen(PORT, () => {
        // define which port to listen to
        console.log(`Listening on port ${PORT}`);
    });
}

main();
