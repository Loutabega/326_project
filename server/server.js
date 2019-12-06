const express = require('express'); //grabbing the main Express module from the package
const app = express(); // each with their own requests and responses

//how to handle a GET request to our server
// first : URL for this function to act upon. '/' : the root of our website in this case : localhost:3000
// second par : a function with two args (req : request that was sent to the server / res : response that we will send back to the client)

app.get('/', (req, res) => {
    res.send('An alligator approaches!');
}); 


app.listen(3000, () => console.log('Gator app listening on port 3000'));