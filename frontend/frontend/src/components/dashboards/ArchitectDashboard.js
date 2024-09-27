// src/components/dashboards/ArchitectDashboard.js
import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar'; // Sidebar Component import
import './ArchitectDashboard.css'; // Add your CSS styling here

const ArchitectDashboard = () => {
    const [appointments, setAppointments] = useState([]);

    // Fetch appointments on component mount
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('http://localhost:8000/appoints'); // Adjust the URL to match your server
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const data = await response.json();
                setAppointments(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    // Handle Notification logic
    const handleNotify = (appointment) => {
        const notifyData = {
            clientName: appointment.clientName,
            email: appointment.email,
            preferredDate: appointment.preferredDate,
            preferredTime: appointment.preferredTime,
        };

        console.log('Notify me clicked for:', notifyData);
        alert(`Reminder set for ${notifyData.clientName}'s appointment on ${notifyData.preferredDate} at ${notifyData.preferredTime}`);
    };

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar for Navigation */}
            <Sidebar role="Architect" userName="Jordan" />
            <div style={{ paddingLeft: '220px', marginTop: '10px' }}>
                {/* Conditionally render the form when the Inspections section is active */}
                {activeSection === 'Site Visit Plannern' && (
                    <div style={{ padding: '20px' }}>
                        <ArchitectDashboard />
                    </div>
                )}
            </div>
            {/* Main Dashboard Content */}
            <div className="dashboard-container">
                <h2>Architect Dashboard</h2>
                <div className="appointments-container">
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <div className="appointment-box" key={appointment._id}>
                                <h3>{appointment.clientName}</h3>
                                <p>Email: {appointment.email}</p>
                                <p>Phone: {appointment.phoneNumber}</p>
                                <p>Project Type: {appointment.projectType}</p>
                                <p>Date: {appointment.preferredDate}</p>
                                <p>Time: {appointment.preferredTime}</p>
                                <p>Location: {appointment.location}</p> {/* Added location field */}
                                <button className="btn btn-custom mt-3" onClick={() => handleNotify(appointment)}>Notify Me</button>
                            </div>
                        ))
                    ) : (
                        <p>No appointments found.</p> // Message when no appointments are available
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArchitectDashboard;
