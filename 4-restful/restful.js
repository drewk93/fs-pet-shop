'use strict'; // Set code to strict mode to prevent errors

// nodemon restful.js
// Core Module
import fs from 'fs'; // File System Module
import express from 'express'; // Express Module
const app = express(); // Server instance start
app.use(express.json()); // express module
const PORT = 3000; // Set port to listen to 

// File Path
const petsPath = '../pets.json' // define path to pets;

async function importPets() { 
    try {
        const data = fs.readFileSync(petsPath, 'utf-8'); // grab the pets.json file and utilize FS readfile function to parse it. 
        return JSON.parse(data) // convert from JSON data
    } catch (err) {
        console.error(err.message) // Log error message to console
        return [];
    }
}
//  Routes 
async function routes(){
    console.log(`---ROUTES---`) // Console log that routes is executed properly

let pets = await importPets(); // Import read functionality


// nodemon restful.js
// Get All
app.get('/pets', (req, res, next) => {
    try {
        if (!pets){ // If there is no pets instance...
            const error = new Error('Pets not available') // Error message
            error.status = 404; // Not Found
            throw error; // throw error to catch
        }
        res.status(200); // OK
        res.json(pets) // Respond with pets as JSON data
    }catch (err) {
        next(err) // Send error to error handling middleware
    }
})

// Get One
app.get('/pets/:index', (req, res, next) => {
    const index = parseInt(req.params.index) // target index in the request path
    try {
        if (!pets || isNaN(index) || index < 0 || index >= pets.length){ // If there is no pets instance, index is not a number, index is less than zero, index is greater than pets array.length...
            const error = new Error ('Pet is not available'); // Error message
            error.status = 404; // Not found
            res.set("Content-Type", "text/plain"); // set response content-type to text/plain
            throw error; // throw error to catch
        }
        res.status(200) // OK
        res.json(pets[index]) // Respond with pet at that pets array as JSON data
    } catch (err) {
        next(err) // Send error to error handling middleware
    }
})

// Post One
app.post('/pets', async (req,res, next) => {
    try {
        const newPet = req.body; // Define variable newPet to be equal to the request body
        if (!newPet.age || !newPet.kind || !newPet.name){ // If the values of age, kind and name are not present in the request body...
            const error = new Error ('Invalid pet data') // Error message
            error.status = 400; // Invalid request
            res.set("Content-Type", "text/plain") //  set response content-type to text/plain
            throw error; // throw error to catch
        }
        pets.push(newPet) // Push newpet instance to pets array (line 27) 
        await fs.promises.writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8'); // Use FS writefile to stringify data to pets.json file
        res.status(201) // Created
        res.json(newPet); // Respond with newPet as confirmation of creation
    } catch (err) {
    next (err) // Send error to error middleware
    }
})

// Patch One 

app.patch('/pets/:id', async (req, res, next) => {
    const index = parseInt(req.params.id) // target index in the request path
    try {
        if (!pets || isNaN(index) || index < 0 || index >= pets.length) { // If there is no pets instance, index is not a number, index is less than zero, index is greater than pets array.length...
            const error = Error('Pet is not available') // Error message
            error.status = 404; // Not found
            throw error; // throw error to catch
        }
        const updatedFields = req.body; // define updatedFields variable to equal the request body (object)
        const existingPet = pets[index]; // target existing pet at pet index

        for (const key in updatedFields) { // Iterate over updatedFields object
            if (updatedFields.hasOwnProperty(key)) { // Target key(property)
                existingPet[key] = updatedFields[key] // Set existing pet key to now equal updated fields key
            }
        }
        await fs.promises.writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8') // Use FS writefile to stringify data to pets.json file
        res.status(200); //OK
        res.json(existingPet) // Respond with existingPet as confirmation of patch
    } catch (err){
        next(err); // Send error to error middleware
    }
})

// Delete One

app.delete('/pets/:id', async(req, res, next) => {
    const index = parseInt(req.params.id) // target index in the request path
    try {
        if(!pets || isNaN(index) || index < 0 || index >= pets.length) {  // If there is no pets instance, index is not a number, index is less than zero, index is greater than pets array.length...
            const error = new Error ('Pet is not available'); // Error message
            error.status = 404; // Not Found
            throw error; // throw error to catch
        }
        // Remove the pet object from the array
        const deletedPet  = pets.splice(index, 1)[0] //Use splice method to remove pet from pet.json file

        // Write the updated pets data back to the file
        await fs.promises.writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8'); // Use FS writefile to stringify data to pets.json file
        res.status(200) // OK
        res.json(deletedPet) // Respond with deleted pet as confirmation of deletion
    } catch (err) {
        next(err) // Send error to error middleware
    }
});

// Error Catch-All Handler

app.use((err, req, res, next) => {
    console.error(err.stack); // List errors from previous functions
    res.set("Content-Type", "text/plain"); //  set response content-type to text/plain
    res.status(err.status || 500) // Internal Server Error
    res.send(err.message); // Use the error's status or default to 500
});

// Port Listener
app.listen(PORT,  () => { 
    console.log(`Listening on Port: ${PORT}`) //Set server to listen to PORT for incoming requests
} )
}

routes(); //Initialize route function
