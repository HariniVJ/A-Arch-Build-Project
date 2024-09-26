// Using Express from express library
const express = require('express');

//creating an instance of express
const app = express();

//define a route - entry point
//the slash '/' indicates the whole root path (http://localhost:3000/)
app.get('/', (req, res) =>{ res.send("Hello World!")})

//start the server
const port = 3000;
app.listen(port, ()=> { console.log("Server is listening to port "+port);})