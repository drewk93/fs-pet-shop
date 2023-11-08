'use strict';


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
        const data = fs.readFileSync(petsPath, 'utf-8'); // grab the pets.json file and read
        return JSON.parse(data) // convert from JSON 
    } catch (err) {
        console.error(err.message)
        return [];
    }
}
//  Routes 
async function routes(){
    console.log(`--- SERVER INITIALIZED---`)

let pets = await importPets();


// nodemon restful.js
// Get All
app.get('/pets', (req, res, next) => {
    try {
        if (!pets){
            const error = new Error('Pets not available')
            error.status = 404; // Not Found
            throw error;
        }
        res.status(200);
        res.json(pets)
    }catch (err) {
        next(err)
    }
})

// Get One
app.get('/pets/:index', (req, res, next) => {
    const index = parseInt(req.params.index) // index
    try {
        if (!pets || isNaN(index) || index < 0 || index >= pets.length){
            const error = new Error ('Pet is not available');
            error.status = 404; 
            throw error;
        }
        res.status(200)
        res.json(pets[index])
    } catch (err) {
        next(err)
    }
})

// Post One
app.post('/pets', async (req,res, next) => {
    try {
        const newPet = req.body;
        if (!newPet.age || !newPet.kind || !newPet.name){
            const error = new Error ('Invalid pet data')
            error.status = 400;
            throw error;
        }
        pets.push(newPet)
        await fs.promises.writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8');
        res.status(201)
        res.json(newPet); 
    } catch (err) {
    next (err)
    }
})

// Patch One 

app.patch('/pets/:id', async (req, res, next) => {
    const index = parseInt(req.params.id)
    try {
        if (!pets || isNaN(index) || index < 0 || index >= pets.length) {
            const error = Error('Pet is not available')
            error.status = 404; 
            throw error;
        }
        const updatedFields = req.body;
        const existingPet = pets[index];

        for (const key in updatedFields) {
            if (updatedFields.hasOwnProperty(key)) {
                existingPet[key] = updatedFields[key]
            }
        }
        await fs.promises.writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8') // Use awa
        res.status(200);
        res.json(existingPet)
    } catch (err){
        next(err);
    }
})

app.delete('/pets/:id', async(req, res, next) => {
    const index = parseInt(req.params.id)
    try {
        if(!pets || isNaN(index) || index < 0 || index >= pets.length) {
            const error = new Error ('Pet is not available');
            error.status = 404; // Not Found
            throw error;
        }
        // Remove the pet object from the array
        const deletedPet  = pets.splice(index, 1)[0]

        // Write the updated pets data back to the file
        await fs.promises.writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8');
        res.status(200) // OK
        res.json(deletedPet) // send JSON deleted pet
    } catch (err) {
        next(err)
    }
});



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message); // Use the error's status or default to 500
});

// Port Listener
app.listen(PORT,  () => {
    console.log(`Listening on Port: ${PORT}`)
} )

}

routes();
