// src/components/appointments/AppointmentCards.js
import React, { useEffect, useState } from 'react';

const AppointmentCards = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('/api/appoints'); 
                const data = await response.json();
                setAppointments(data); // Adjust based on your API response structure
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };
        fetchAppointments();
    }, []);

    return (
        <div className="appointment-cards">
            {appointments.map(appointment => (
                <div className="card" key={appointment._id}>
                    <h3>{appointment.clientName}</h3>
                    <p>Email: {appointment.clientEmail}</p>
                    <p>Phone: {appointment.clientPhone}</p>
                    <p>Project Type: {appointment.projectType}</p>
                    <p>Date: {appointment.date}</p>
                    <p>Time: {appointment.time}</p>
                    <button onClick={() => handleUpdate(appointment._id)}>Update</button>
                    <button onClick={() => handleDelete(appointment._id)}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default AppointmentCards;
