const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB for project database
const projectDB = mongoose.createConnection('mongodb://localhost:27017/archbuild');

projectDB.on('connected', () => {
    console.log('Project DB connected');
});

// Handle connection errors
projectDB.on('error', (err) => {
    console.log('Connection error:', err);
});

// Define Project Schema
const projectSchema = new mongoose.Schema({
    projectname: {
        type: String,
        required: true,
    },
    description: String,
    projecttype: String,
    location: String,
    duration: Number,
    startdate: Date,
    projectstatus: String,
    clientname: String,
    sitecode: String,
    teammembers: Number,
});

const Project = projectDB.model('Project', projectSchema);

// Route to create a new project
app.post('/projects', async (req, res) => {
    const {
        projectname, description, projecttype, location,
        duration, startdate, projectstatus, clientname, sitecode, teammembers,
    } = req.body;

    try {
        const newProject = new Project({
            projectname, description, projecttype, location,
            duration, startdate, projectstatus, clientname, sitecode, teammembers,
        });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Route to get projects with optional search and pagination
app.get('/projects/:id?', async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 6, search } = req.query;

    try {
        if (id) {
            const project = await Project.findById(id);
            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }
            return res.json(project);
        } 
        
        const query = search ? { projectname: { $regex: search, $options: 'i' } } : {};

        const projects = await Project.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalProjects = await Project.countDocuments(query);

        return res.json({
            data: projects,
            totalPages: Math.ceil(totalProjects / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Route to update a project by ID
app.put('/projects/:id', async (req, res) => {
    const {
        projectname, description, projecttype, location,
        duration, startdate, projectstatus, clientname, sitecode, teammembers,
    } = req.body;

    try {
        const id = req.params.id;
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { projectname, description, projecttype, location, duration, startdate, projectstatus, clientname, sitecode, teammembers },
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(updatedProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a project by ID
app.delete('/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const project = await Project.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Export the app
module.exports = app;
