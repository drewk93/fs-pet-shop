'use strict';

import fs from 'fs';
import http from 'http';
import url from 'url';

const petsPath = '../pets.json';

let pets = undefined;

function start() {
    console.log('Server is running');
    importPetsFromDatabase();

    const server = http.createServer(function(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const urlArray = parsedUrl.pathname.split('/').filter(Boolean); // Remove empty elements

        if (req.method === 'GET' && urlArray[0] === 'pets') {
            if (urlArray.length === 1) {
                // Handle '/pets' endpoint
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(pets));
            } else if (urlArray.length === 2 && !isNaN(urlArray[1])) {
                // Handle '/pets/:index' endpoint
                const index = parseInt(urlArray[1]);

                if (index >= 0 && index < pets.length) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(pets[index]));
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Pet not found');
                }
            } else {
                // Invalid URL
                res.statusCode = 400;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Bad Request');
            }
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Not found');
        }
    });

    const port = process.env.PORT || 8000;
    server.listen(port, function() {
        console.log('Listening on port', port);
    });
}

const importPetsFromDatabase = () => {
    const data = fs.readFileSync(petsPath, 'utf8');
    pets = JSON.parse(data);
}

start();