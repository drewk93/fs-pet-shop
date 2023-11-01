'use strict';

import fs from 'fs';
import http from 'http';

const petsPath = '../pets.json';
import url from 'url'

let pets = undefined;

function start() {
    console.log('Server is running');
    importPetsFromDatabase();

    const server = http.createServer(function(req, res) {
        const parsedUrl = url.parse(req.url, true)
        let urlArray = parsedUrl.path.split('/')
        
        console.log(urlArray[1])
        res.end(JSON.stringify(pets))


        // if (req.method === 'GET' && req.url === '/pets') {
        //     const petsJSON = JSON.stringify(pets);

        //     res.setHeader('Content-Type', 'application/json');
        //     res.end(petsJSON);
        // } else {
        //     res.statusCode = 404;
        //     res.setHeader('Content-Type', 'text/plain');
        //     res.end('Not found');
        // }
    });
    const port = process.env.PORT || 8000;
    server.listen(port, function() {
        console.log('Listening on port', port);
    });
}

const importPetsFromDatabase = () => {
    const data = fs.readFileSync(petsPath, 'utf8'); // Specify 'utf8' encoding to read the file as a text
    pets = JSON.parse(data);
}

start();