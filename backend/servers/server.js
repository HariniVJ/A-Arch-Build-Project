const express = require('express');
const inspectionApp = require('./inspectionServer');
const projectApp = require('./projectServer');
const reqApp = require('./clientreq')
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use the inspection server routes with prefix /inspection
app.use('/inspection', inspectionApp);

// Use the project server routes with prefix /project
app.use('/project', projectApp);

//req server
app.use('/req', reqApp);



// Listen on a single port
app.listen(8000, () => {
    console.log('Server running on port 8000');
});
