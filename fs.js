import fs from "fs"

const petDatabaseFilePath = "../pets.json"

let pets = undefined

const start = () => {

    importPetsFromDatabase() // read function for incoming data

    const command = process.argv[2] // recording inputs to terminal

    
    if (command === "create") { // create new instance of "pet"
        create(parseInt(process.argv[3]), process.argv[4], process.argv[5]) // processing separate arguments
    }

    else if (command === "read") { // read existing pets array
        read(process.argv[3]) // processing single argument  
    }

    else if (command === "update") { // update existing pets array
        update(parseInt(process.argv[3]), process.argv[4], process.argv[5], process.argv[6]) // processing multiple arguments
    }

    else if (command === "destroy") { // destroy existing pets
        destroy(parseInt(process.argv[3])) // processing single argument
    }

    else {
        console.error("Usage: node fs.js read | create | update | destroy]") // default error message notifying user of commands
        process.exit(1) // process exit code
    }
}

const importPetsFromDatabase = () => { // import function
    const data = fs.readFileSync(petDatabaseFilePath) // using file system to read individual pets
    pets = JSON.parse(data) // parsing pets into 'readable' data for JS to iterate through.
}

const updateDatabase = () => {
    fs.writeFileSync(petDatabaseFilePath, JSON.stringify(pets)) // using file system to write / over-write
}

const create = (petAge, petKind, petName) => {
    if ([petAge, petKind, petName].includes(undefined)) { // error case if user does not define age, kind and name for new pet instance.
        console.log("Usage: node ./js.js create <age> <kind> <name>") 
        process.exit(1)
    } else {
        const pet = { age: petAge, kind: petKind, name: petName } // if valid input received, use as arguments.
        pets.push(pet) // push arguments as new object to pets array
        updateDatabase() // callback for update database (using file system to write)
    }
}

const read = (petIndex) => { 
    if (petIndex === undefined) { 
        for (const pet of pets) console.log(pet) // log pets  if petIndex is undefined
    } else if (petIndex >= 0 && petIndex < pets.length) { // log individual pet if input received is valid
        console.log(pets[petIndex])
    } else {
        console.log("Usage: node ./js.js read <index>") // error case
    }
}

const update = (petIndex, petAge, petKind, petName) => { // updates existing pet, locating by index and redefining key/value pairs
    if ([petIndex, petAge, petKind, petName].includes(undefined) || petIndex < 0 || petIndex >= pets.length) {
        console.log("Usage: node ./js.js update <index> <age> <kind> <name>") // error case
        process.exit(1) // exit code
    } else {
        const pet = { age: petAge, kind: petKind, name: petName } // updates pet
        pets[petIndex] = pet // index of pet being targeted
        updateDatabase() // callback for update database (using file system to write)
    }
}

const destroy = (petIndex) => { // destroys pet array
    if (petIndex === undefined || petIndex < 0 || petIndex >= pets.length) {
        console.error("Usage: node ./js.js delete <index>") // error message
        process.exit(1)
    } else {
        pets = pets.slice(0, petIndex).concat(pets.slice(petIndex + 1)) // using slice method to "destroy" existing pet
        console.log("Pet destroyed.") // log message
        updateDatabase() // callback for update database (using file system to write) 
    }
}

start() // invoke entire 'start' function to start.