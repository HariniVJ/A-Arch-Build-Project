const express = require('express'); // Using Express from express library
const mongoose = require('mongoose');//Using mongoose

//creating an instance of express
const app = express();

//getting a middleware to decode json to text
app.use(express.json());

//connect MongoDB
mongoose.connect('mongodb://localhost:27017/inspection').then(() => {
    console.log('DB connected')
})
.catch((err) => {
    console.log(err)
})


//Create Schema
const inspectionSchema = new mongoose.Schema({
        sitecode : {
            required : true,
            type : String,
        },
        projectname : {
            required : true,
            type : String,
        }, 
        ititle : {
            required : true,
            type : String,
        },
        itype : {
            required : true,
            type : String,
        },
        idate : {
            required : true,
            type : String,
        }, 
        itime : {
            required : true,
            type : String,
        },
        assignee : {
            required : true,
            type : String,
        },
        projectcomplexity : {
            required : true,
            type : String,
        },
        addnote : {
            required : true,
            type : String,
        },
})

//create model
const imodel = mongoose.model('Inspection', inspectionSchema)


//define path for inspection create form
app.post('/createinspection', async (req, res) =>{ 
    const {sitecode, projectname, ititle, itype, idate, itime, assignee, projectcomplexity, addnote}= req.body;

    try{
        const inew = new imodel({sitecode, projectname, ititle, itype, idate, itime, assignee, projectcomplexity, addnote});
        await inew.save();
        res.status(201).json(inew);
    }catch (error) {
        console.log(error);
        res.status(500).json({message : error.message});
    }
   
    
})

//get or read inspections
app.get('/createinspection', async(req, res) => {
try{
    const inspectionslist = await imodel.find();
    res.json(inspectionslist);
} catch (error){
    console.log(error);
    res.status(500).json({message : error.message});
}  
})


//Update inspection
app.put('/createinspection/:id', async(req, res) => {
    try{
        const {sitecode, projectname, ititle, itype, idate, itime, assignee, projectcomplexity, addnote}= req.body;
        const id = req.params.id;

        const updatedInspection = await imodel.findByIdAndUpdate(
        id,
        {sitecode, projectname, ititle, itype, idate, itime, assignee, projectcomplexity, addnote},
        { new : true}
    )

    if(!updatedInspection){
        return res.status(404).json({message : "Inspection NOT FOUND!!!!"});
    }
    res.json(updatedInspection)

    } catch(error){
        console.log(error);
        res.status(500).json({message : error.message});
    }
})


//Delete inspection
app.delete('/createinspection/:id', async (req, res) => {
    try{
        const id = req.params.id;
        await imodel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error){
        console.log(error);
        res.status(500).json({message : error.message});
    }

})

//start the server
const port = 3000;
app.listen(port, ()=> { console.log("Server is listening to port "+port);})