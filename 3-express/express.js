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


    importPets();

    function importPets() {
        const data = fs.readFileSync(petsPath, 'utf8'); // grab the pets.json file and read
        pets = JSON.parse(data); // set pets variable to parsed data
        
    }
    // middleware to parse JSON request bodies
    app.use(express.json())
    // Handle GET requests for the entire pets array
   

    app.get('/pets', (req, res) => {
        res.status(200)
        res.send(pets);
    });

// Handle get requests for indexed pets
app.get('/pets/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < pets.length) {
        res.status(200);
        res.send(pets[index]);
    } else {
        res.status(404)
        res.send('Not found');
    }
});

app.post('/pets', (req, res) => {
    const newPet = req.body; // Get the pet data from the request body
    console.log("Working")
    // Check if the required fields are present in the request body
    if (!newPet.age || !newPet.kind || !newPet.name) {
        res.status(400).send('Bad Request: Missing required fields (age, kind, name)');
    } else {
        // Add the new pet to the pets array
        pets.push(newPet);

        // Save the updated pets array to the pets.json file
        fs.writeFileSync(petsPath, JSON.stringify(pets, null, 2), 'utf8');

        // Return the newly added pet as the response
        res.status(201).json(newPet);
    }
});

console.log(pets);

// Handle all other routes
app.use((req, res) => {
    res.status(404).send('Not Found');
});

    app.listen(PORT, () => {
        // define which port to listen to
        console.log(`Listening on port ${PORT}`);
    });
}

main();
