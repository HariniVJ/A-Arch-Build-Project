const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());



// Create a new independent connection for the Inspection database
const inspectionDB = mongoose.createConnection('mongodb://localhost:27017/inspection');

inspectionDB.on('connected', () => {
    console.log('Inspection DB connected');
});

// Handle connection errors
inspectionDB.on('error', (err) => {
    console.log('Connection error:', err);
});


// Create Inspection Schema
const inspectionSchema = new mongoose.Schema({
    sitecode: {
        required: true,
        type: String,
    },
    projectname: {
        required: true,
        type: String,
    },
    ititle: {
        required: true,
        type: String,
    },
    itype: {
        required: true,
        type: String,
    },
    idate: {
        required: true,
        type: String,
    },
    itime: {
        required: true,
        type: String,
    },
    assignee: {
        required: true,
        type: String,
    },
    projectcomplexity: {
        required: true,
        type: String,
    },
    location: {
        required: true,
        type: String,
    },
});

// Create Inspection model
const imodel = inspectionDB.model('Inspection', inspectionSchema);


// Create Notification Schema
const notificationSchema = new mongoose.Schema({
    message: String,
    date: { type: Date, default: Date.now },
    assignee: String,
});

// Create Notification model
const Notification = inspectionDB.model('Notification', notificationSchema);

// Define path for creating an inspection

app.post('/createinspection', async (req, res) => {
    const { sitecode, projectname, ititle, itype, idate, itime, assignee, projectcomplexity, location } = req.body;

    try {
        const inew = new imodel({ sitecode, projectname, ititle, itype, idate, itime, assignee, projectcomplexity, location });
        await inew.save();

        // Send a notification if the assignee is Morgan
        if (assignee === 'Morgan') {
            await Notification.create({ message: `New inspection created: ${ititle}`, assignee: 'Morgan' });
        }

        res.status(201).json(inew);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating inspection', error: error.message });
    }
});

// Get or read inspections
app.get('/inspection/createinspection', async (req, res) => {
    try {
        const inspectionslist = await imodel.find();
        res.json(inspectionslist);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching inspections', error: error.message });
    }
});

app.put('/createinspection/:id', async (req, res) => {
    try {
        const { sitecode, projectname, ititle, itype, idate, itime, assignee, projectcomplexity, location } = req.body;
        const id = req.params.id;

        // Find the existing inspection
        const existingInspection = await imodel.findById(id);
        if (!existingInspection) {
            return res.status(404).json({ message: "Inspection NOT FOUND!" });
        }

        // Update the inspection
        const updatedInspection = await imodel.findByIdAndUpdate(
            id,
            { sitecode, projectname, ititle, itype, idate, itime, assignee, projectcomplexity, location },
            { new: true }
        );

        // Check if the assignee has changed from Morgan to someone else
        if (existingInspection.assignee === 'Morgan' && assignee !== 'Morgan') {
            // Delete the old notification
            await Notification.deleteOne({ message: `New inspection created: ${existingInspection.ititle}`, assignee: 'Morgan' });
        }

        // If the assignee is Morgan, check for existing notification
        if (assignee === 'Morgan') {
            const existingNotification = await Notification.findOne({ message: `New inspection created: ${ititle}`, assignee: 'Morgan' });
            // Only create a new notification if it doesn't already exist
            if (!existingNotification) {
                await Notification.create({ message: `New inspection created: ${ititle}`, assignee: 'Morgan' });
            }
        }

        res.json(updatedInspection);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating inspection', error: error.message });
    }
});

// Delete inspection and associated notification
app.delete('/createinspection/:id', async (req, res) => {
    try {
      const id = req.params.id;
  
      // Find the inspection to be deleted
      const deletedInspection = await imodel.findByIdAndDelete(id);
      if (!deletedInspection) {
        return res.status(404).json({ message: "Inspection NOT FOUND!" });
      }
  
      // Delete the associated notification if the assignee is Morgan
      if (deletedInspection.assignee === 'Morgan') {
        await Notification.deleteOne({ message: `New inspection created: ${deletedInspection.ititle}`, assignee: 'Morgan' });
      }
  
      res.status(204).end();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error deleting inspection', error: error.message });
    }
  });

// Get notifications for Morgan along with inspection details
app.get('/notifications', async (req, res) => {
    try {
      // Fetch notifications for Morgan
      const notifications = await Notification.find({ assignee: 'Morgan' });
  
      // Fetch the corresponding inspection details
      const inspections = await imodel.find({ assignee: 'Morgan' });
  
      // Map notifications to include inspection details
      const notificationsWithDetails = notifications.map(notification => {
        const inspectionDetail = inspections.find(inspection => inspection.ititle === notification.message.split(': ')[1]);
        return {
          ...notification.toObject(), // Convert mongoose document to plain JavaScript object
          inspectionDetails: inspectionDetail || null // Include inspection details if available
        };
      });
  
      res.json(notificationsWithDetails);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
  });

// Export the app
module.exports = app;
