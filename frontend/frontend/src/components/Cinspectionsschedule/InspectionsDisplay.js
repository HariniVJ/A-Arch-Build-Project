import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, TextField, Box, InputAdornment, Modal, Fade, FormControl, Select, MenuItem, InputLabel, Snackbar } from '@mui/material';
import RescheduleIcon from '@mui/icons-material/Update'; // Icon for Reschedule
import CancelIcon from '@mui/icons-material/Cancel'; // Icon for Cancel
import SearchIcon from '@mui/icons-material/Search'; // Icon for Search
import MuiAlert from '@mui/material/Alert';
import cancel from '../assets/cancel.png';

const apiUrl = "http://localhost:8000/inspection"; // Make sure this matches your API

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const InspectionsDisplay = () => {
    const [inspections, setInspections] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [recentActivities, setRecentActivities] = useState([]);
    const [selectedInspection, setSelectedInspection] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [updatedData, setUpdatedData] = useState({ ititle: '', idate: '', itime: '', assignee: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const assignees = ["Akashwaran", "Alex", "Riley", "Morgan"];

    useEffect(() => {
        const fetchInspections = async () => {
            try {
                const response = await fetch(`${apiUrl}/inspection/createinspection`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setInspections(data);
            } catch (error) {
                console.error("Error fetching inspections:", error);
            }
        };

        const fetchRecentActivities = async () => {
            try {
                const response = await fetch(`${apiUrl}/recent-activities`);
                if (!response.ok) throw new Error('Network response was not ok');
                const activitiesData = await response.json();
                setRecentActivities(activitiesData);
            } catch (error) {
                console.error("Error fetching recent activities:", error);
            }
        };

        fetchInspections();
        fetchRecentActivities();
    }, []);

    const filteredInspections = inspections.filter(inspection =>
        inspection.projectname.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by project name
        inspection.location.includes(searchTerm)      // Search by location
    );
    
    

    const handleOpenModal = (inspection) => {
        setSelectedInspection(inspection);
        setUpdatedData({
            ititle: inspection.ititle,
            idate: inspection.idate.split('T')[0], // Format for date input
            itime: inspection.itime,
            assignee: inspection.assignee
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData({
            ...updatedData,
            [name]: value
        });
    };

    //handles Update
    const handleConfirm = async () => {
        try {
            const response = await fetch(`${apiUrl}/createinspection/${selectedInspection._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error('Failed to update inspection');
            }

            const updatedInspection = await response.json();
            setInspections(inspections.map(ins => ins._id === updatedInspection._id ? updatedInspection : ins));
            handleCloseModal();

            // Show Snackbar confirmation message
            setSnackbarMessage("Inspection updated successfully!");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error updating inspection:", error);
        }
    };

    const handleOpenConfirmModal = (inspection) => {
        setSelectedInspection(inspection);
        setOpenConfirmModal(true);
    };

    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
    };

    //handles delete
    const handleDelete = async () => {
        try {
            const response = await fetch(`${apiUrl}/createinspection/${selectedInspection._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete inspection');
            }

            setInspections(inspections.filter(ins => ins._id !== selectedInspection._id));
            setSnackbarMessage("Inspection deleted successfully!");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error deleting inspection:", error);
        } finally {
            handleCloseConfirmModal();
        }
    };

    return (
        <div>
            <Box display="flex" alignItems="center" mb={2} position="relative" width="100%" style={{ marginBottom: '20px' }}>
                <TextField
                    variant="outlined"
                    placeholder="Search Inspections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Grid container spacing={2}>
                {filteredInspections.map((inspection) => (
                    <Grid item xs={12} sm={6} md={4} key={inspection._id}>
                        <Card style={{ background: 'linear-gradient(180deg, #EFF396, #59B4C3)', borderRadius: '30px' }}>
                            <CardContent>
                                <Typography variant="h5">{inspection.ititle}</Typography>
                                <Typography color="textSecondary">{inspection.itype}</Typography>
                                <Typography variant="body2">Project Name: {inspection.projectname}</Typography>
                                <Typography variant="body2">Site Code: {inspection.sitecode}</Typography>
                                <Typography variant="body2">Date: {inspection.idate}</Typography>
                                <Typography variant="body2">Time: {inspection.itime}</Typography>
                                <Typography variant="body2">Assignee: {inspection.assignee}</Typography>
                                <Typography variant="body2">Complexity: {inspection.projectcomplexity}</Typography>
                                <Typography variant="body2">Location: {inspection.location}</Typography>

                                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        variant="contained"
                                        sx={{ width: '48%' }}
                                        startIcon={<RescheduleIcon />}
                                        onClick={() => handleOpenModal(inspection)}
                                    >
                                        Reschedule
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ width: '48%', backgroundColor: 'red', color: 'white' }}
                                        startIcon={<CancelIcon />}
                                        onClick={() => handleOpenConfirmModal(inspection)} // Opens the confirmation modal
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
         
            <Modal
                open={openConfirmModal}
                onClose={handleCloseConfirmModal}
                closeAfterTransition
                aria-labelledby="confirmation-modal-title"
                aria-describedby="confirmation-modal-description"
            >
                <Fade in={openConfirmModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 300,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '20px',
                        textAlign: 'center'
                    }}>
                        <Typography id="confirmation-modal-title" variant="h6" component="h2">
                            Are you sure you want to cancel the schedule?
                        </Typography>
                        <img src={cancel} alt="Confirmation" style={{ width: '100px', margin: '20px 0' }} />
                        <div>
                            <Button variant="contained" color="error" onClick={handleDelete} sx={{ mr: 2 }}>
                                Yes
                            </Button>
                            <Button variant="outlined" onClick={handleCloseConfirmModal}>
                                No
                            </Button>
                        </div>
                    </Box>
                </Fade>
            </Modal>

            {/* Modal for Rescheduling */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
            >
                <Fade in={openModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '20px'
                    }}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Reschedule Inspection
                        </Typography>
                        <TextField
                            label="Inspection Title"
                            name="ititle"
                            value={updatedData.ititle}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Inspection Date"
                            name="idate"
                            type="date"
                            value={updatedData.idate} // Displays the fetched date
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Inspection Time"
                            name="itime"
                            type="time"
                            value={updatedData.itime} // Displays the fetched time
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="assignee-label">Assignee</InputLabel>
                            <Select
                                labelId="assignee-label"
                                name="assignee"
                                value={updatedData.assignee}
                                onChange={handleInputChange}
                            >
                                {assignees.map((assignee) => (
                                    <MenuItem key={assignee} value={assignee}>{assignee}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" onClick={handleConfirm} sx={{ mr: 2 }}>
                                Confirm
                            </Button>
                            <Button variant="outlined" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                        </div>
                    </Box>
                </Fade>
            </Modal>

            {/* Snackbar for confirmation */}
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* ... existing JSX code for searching and displaying inspections */}

            
        </div>
    );
};

export default InspectionsDisplay;
