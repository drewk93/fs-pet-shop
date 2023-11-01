'use strict';

// Import required modules
import fs from 'fs'; // File system module for reading and writing files
import http from 'http'; // HTTP module for creating an HTTP server
import url from 'url'; // URL module for parsing request URLs

// Define the path to the JSON file containing pet data
const petsPath = '../pets.json';

// Initialize the variable to store pet data
let pets = undefined;

// Define a regular expression to match paths like '/pets/:index'
const petRegExp = /^\/pets\/(\d+)$/;

// Define the main server function
function start() {
    console.log('Server is running');

    // Import pet data from the database (JSON file)
    importPetsFromDatabase();

    // Create an HTTP server
    const server = http.createServer(function(req, res) {
        const parsedUrl = url.parse(req.url, true);

        // Check if it's a GET request
        if (req.method === 'GET') {
            // Handle the GET request
            handleGetRequest(req, res, parsedUrl);
        } else if (req.method === 'POST') {
            // Handle POST requests to add new pets
            handlePostRequest(req, res, parsedUrl);
        } else {
            // For other HTTP methods, return a 405 Method Not Allowed response
            res.statusCode = 405;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Method Not Allowed');
        }
    });

    // Define the server's listening port
    const port = process.env.PORT || 8000;

    // Start the server
    server.listen(port, function() {
        console.log('Listening on port', port);
    });
}

// Function to import pet data from the database (JSON file)
const importPetsFromDatabase = () => {
    // Read the JSON file and parse its content
    const data = fs.readFileSync(petsPath, 'utf8');
    pets = JSON.parse(data);
}

// Function to handle GET requests
function handleGetRequest(req, res, parsedUrl) {
    if (parsedUrl.pathname === '/pets') {
        // Handle '/pets' endpoint by returning the list of all pets
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(pets));
    } else {
        // Try to match the pet index using the regular expression
        const match = parsedUrl.pathname.match(petRegExp);

        if (match) {
            // Extract the index from the matched URL
            const index = parseInt(match[1]);

            if (index >= 0 && index < pets.length) {
                // Handle '/pets/:index' endpoint by returning the specific pet
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(pets[index]));
            } else {
                // Pet not found, return a 404 response
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Pet not found');
            }
        } else {
            // Invalid URL, return a 400 Bad Request response
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Bad Request');
        }
    }
}

// Function to handle POST requests
function handlePostRequest(req, res, parsedUrl) {
    if (parsedUrl.pathname === '/pets') {
        // Initialize a variable to collect the request body data
        let requestBody = '';

        // Listen for data chunks in the request body
        req.on('data', function(chunk) {
            // Collect and concatenate the data chunks
            requestBody += chunk;
        });

        // Once all data is received, process it
        req.on('end', function() {
            try {
                // Parse the request body as JSON
                const newPet = JSON.parse(requestBody);

                // Add the new pet to the existing pets array
                pets.push(newPet);

                // Write the updated pets array back to the JSON file
                fs.writeFileSync(petsPath, JSON.stringify(pets, null, 2), 'utf8');

                // Respond with a 201 Created status and the added pet
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(newPet));
            } catch (error) {
                // Handle JSON parsing or file writing errors
                res.statusCode = 400;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Bad Request: Invalid JSON data');
            }
        });
    } else {
        // Requested URL path is not '/pets', return a 404 response
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
    }
}

// Start the server
start();