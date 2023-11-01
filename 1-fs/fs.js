import fs from 'fs';
<<<<<<< HEAD
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const dataFilePath = path.join(__dirname, '..', 'pets.json');

const dataFilePath = "../pets.json" // path to pets.json file


const command = process.argv[2]; // command argument
=======
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '..', 'pets.json');

// Check for command-line arguments
const command = process.argv[2];
>>>>>>> 7a315b078194a1b240113373509e8e97e6b31949
const index = process.argv[3]; // Index argument

if (command === 'read') {
  // Execute the "read" operation
  fs.readFile(dataFilePath, 'utf8', (error, data) => {
    if (error) {
      console.error('Error reading file:', error);
      process.exit(1); // Exit the script with an error code
    } else {
      const jsonData = JSON.parse(data); 
      
      if (index !== undefined) {
        const object = jsonData[index];
        if (object) {
          console.log(object);
        } else {
          console.error('object not found at index', index);
          process.exit(1); // Exit the script with an error code
        }
      } else {
        console.log(jsonData);
      }
    }
  });
} else {
  // Display usage information if the "read" command is not provided
  console.error('Usage: node fs.js read [index]');
  process.exit(1); // Exit the script with an error code
}
