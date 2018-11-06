/*
* Simple Hello world api
*/

// Dependencies
var http = require('http');
var config = require('./config');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;


// Initialize the server
var httpServer = http.createServer(function(req, res) {
    server(req, res);
});

// Start the server
httpServer.listen(config.httpPort, function() {
    console.log(`Server now listening on port: ${config.httpPort}`);
});

const server = function(req, res) {
    // Get the URL
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const trimmedPath = parsedUrl.pathname.replace(/^\/+|\+$/g,'');

    // Get the method
    const method = req.method.toLowerCase();

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get headers
    const headers = req.headers;

    // Get the payload if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();
        /* Choose the handler this request should go to
        *  If not found choose the notFound handler
        */
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

         // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler, or a default 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) === 'object' ? payload : {};

             // Convert the payload to a string
            const payloadString = JSON.stringify(payload);

            // Return response;
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

// Define the handlers
var handlers = {};

handlers.hello = (data, callBack) => {
    callBack(200, { message : `Hey, what's up`});
};

handlers.notFound = (data, callBack) => {
    callBack(404);
};

// Request Router
var router = {
    'hello' : handlers.hello
}