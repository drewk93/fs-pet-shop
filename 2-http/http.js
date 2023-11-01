'use strict';

import fs from 'fs';
import http from 'http';
import url from 'url';

const petsPath = '../pets.json';

let pets = undefined;

const petRegExp = /^\/pets\/(\d+)$/; // Match '/pets/:index'

function start() {
    console.log('Server is running');
    importPetsFromDatabase();

    const server = http.createServer(function(req, res) {
        const parsedUrl = url.parse(req.url, true);

        if (req.method === 'GET' && parsedUrl.pathname === '/pets') {
            // Handle '/pets' endpoint
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(pets));
        } else {
            // Try to match the pet index using the regular expression
            const match = parsedUrl.pathname.match(petRegExp);

            if (match) {
                const index = parseInt(match[1]);

                if (index >= 0 && index < pets.length) {
                    // Handle '/pets/:index' endpoint
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(pets[index]));
                } else {
                    // Pet not found
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