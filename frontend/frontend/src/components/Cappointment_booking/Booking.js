import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styled from 'styled-components';
import './AppointmentStyles.css'; 

// Define styled component for crossed-out dates
const CrossedOutDate = styled.div`
  text-decoration: line-through;
  color: red;
`;


export default function Booking() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        clientName: "",
        email: "",
        phoneNumber: "",
        projectType: "",
        preferredDate: "",
        preferredTime: "",
        location: "",
        purpose: "",
        receiveNotifications: false,
        termsAccepted: false
    });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [submittedData, setSubmittedData] = useState(null);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [bookedDates, setBookedDates] = useState([]); // State to manage booked dates

    const apiUrl = "http://localhost:8000/appoints";

    useEffect(() => {
        // Fetch booked dates on component mount
        const fetchBookedDates = async () => {
            try {
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const appointments = await response.json();
                    const dates = appointments.map(app => app.preferredDate);
                    setBookedDates(dates);
                }
            } catch (error) {
                console.error("Failed to fetch booked dates", error);
            }
        };

        fetchBookedDates();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        const { clientName, email, phoneNumber, projectType, preferredDate, preferredTime, location, purpose } = formData;
        if (clientName && email && phoneNumber && projectType && preferredDate && preferredTime && location && purpose) {
            try {
                const url = isUpdateMode ? `${apiUrl}/${submittedData._id}` : apiUrl;
                const method = isUpdateMode ? "PUT" : "POST";

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
        alert("Please enter a valid email address.");
        return; // Exit if email is invalid
    }

    const phonePattern = /^\d{10}$/; // Assuming a 10-digit phone number
    if (!phonePattern.test(formData.phoneNumber)) {
        alert("Please enter a valid phone number (10 digits).");
        return; // Exit if phone number is invalid
    }



                if (response.ok) {
                    const updatedData = await response.json();
                    setSubmittedData(updatedData);
                    setMessage(isUpdateMode ? "Appointment updated successfully" : "Appointment created successfully");
                    setError("");
                    setStep(3);
                    setIsUpdateMode(false);
                } else {
                    const errorData = await response.json();
                    setError(`Error: ${errorData.message || "Unable to process the request"}`);
                    setMessage("");
                }
            } catch (err) {
                setError(`Network error: ${err.message}`);
                setMessage("");
            }
        } else {
            setError("Please fill in all required fields");
        }
        console.log("Form submitted successfully!", formData);
    };

    const handleDownloadPDF = () => {
        if (submittedData) {
            const doc = new jsPDF();
    
            // Load the logo image
            const logoImg = new Image();
            logoImg.src = `${process.env.PUBLIC_URL}/logo.jpg`; // Replace with your actual logo path
            logoImg.onload = function() {
                // Load the background image
                const backgroundImg = new Image();
                backgroundImg.src = `${process.env.PUBLIC_URL}/pic1.jpg`; // Replace with your actual background path
                backgroundImg.onload = function() {
                    // Add background image to the PDF
                    doc.addImage(backgroundImg, 'JPG', 0, 0, 210, 297); // A4 size
    
                    // Adjust the logo size (width and height)
                    const logoWidth = 30; // Set your desired width
                    const logoHeight = 32; // Set your desired height
    
                    // Add logo image on top of the background
                    doc.addImage(logoImg, 'JPG', 150, 10, logoWidth, logoHeight); // Adjust logo position and size
    
                    // Add the table with appointment details
                    doc.setFontSize(16);
                    doc.text("Appointment Overview", 10, 30); // Move text down
    
                    // Adjust the startY parameter to bring the table down
                    doc.autoTable({
                        startY: 40, // Increase this value to move the table further down
                        head: [['Field', 'Details']],
                        body: [
                            ['Client Name', submittedData.clientName],
                            ['Email', submittedData.email],
                            ['Phone Number', submittedData.phoneNumber],
                            ['Project Type', submittedData.projectType],
                            ['Date of Appointment', submittedData.preferredDate],
                            ['Time Chosen', submittedData.preferredTime],
                            ['Purpose', submittedData.purpose]
                        ],
                        margin: { horizontal: 10 },
                        styles: { fontSize: 12 },
                        headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] }, // Blue header
                        alternateRowStyles: { fillColor: [240, 240, 240] } // Light gray for alternate rows
                    });
    
                    // Add confirmation message
                    doc.setFontSize(12);
                    doc.setTextColor(0, 128, 0); // Green color
                    doc.text("The appointment with the architect is confirmed now.", 16, doc.autoTable.previous.finalY + 10);

    
                    // Save the PDF
                    doc.save("appointment_overview.pdf");
                };
                backgroundImg.onerror = function() {
                    console.error("Error loading background image.");
                };
            };
            logoImg.onerror = function() {
                console.error("Error loading logo image.");
            };
        } else {
            console.error("No submitted data available");
        }
    };
    
    

    const handleUpdate = () => {
        setFormData(submittedData);
        setIsUpdateMode(true);
        setStep(1);
    };

    const handleDelete = async () => {
        if (submittedData && submittedData._id) {
            try {
                const response = await fetch(`${apiUrl}/${submittedData._id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    setSubmittedData(null);
                    setFormData({
                        clientName: "",
                        email: "",
                        phoneNumber: "",
                        projectType: "",
                        preferredDate: "",
                        preferredTime: "",
                        location: "",
                        purpose: "",
                        receiveNotifications: false,
                        termsAccepted: false
                    });
                    setMessage("Appointment deleted successfully");
                    setError("");
                    setStep(1);
                } else {
                    const errorData = await response.json();
                    setError(`Error: ${errorData.message || "Unable to delete the appointment"}`);
                    setMessage("");
                }
            } catch (err) {
                setError(`Network error: ${err.message}`);
                setMessage("");
            }
        } else {
            setError("No appointment selected for deletion");
        }
    };

    const isDateBooked = (date) => {
        return bookedDates.includes(date);
    };

    // Get today's date in the format YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // Style object for the background image
    const backgroundStyle = {
        backgroundImage: `url('cons.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px'
    };
    const handleDateSelection = (e) => {
        const selectedDate = e.target.value;
        
        // Check if the selected date is booked
        if (isDateBooked(selectedDate)) {
            alert("This date is already booked. Please select another date.");
            setFormData({ ...formData, preferredDate: "" }); // Clear the selection
            setError("This date is already booked. Please choose another date.");
        } else {
            setError("");
            setFormData({ ...formData, preferredDate: selectedDate });
        }
    };

    
    
      

    return (
        <div style={backgroundStyle} className="container mt-5">
            <div className="appointment-header">
                <h1>Book Your Appointment with Our Experts</h1>
            </div>

            <div className="row mt-3">
                <div className="col-md-6">
                    <div className={`card mb-3 ${step === 2 ? "opacity-50" : ""}`}>
                        <div className="card-body">
                            {step === 1 && (
                                <>
                                    <h3>Step 1: Client Details</h3>
                                    <div className="form-group">
                                        <label>Client Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="clientName"
                                            value={formData.clientName}
                                            onChange={handleChange}
                                            placeholder="Enter client name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter email"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Project Type</label>
                                        <select
                                            className="form-control"
                                            name="projectType"
                                            value={formData.projectType}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Project Type</option>
                                            <option value="Design" className="design-option">Design</option>
                                            <option value="Construction" className="construction-option">Construction</option>
                                            <option value="Both" className="both-option">Both</option>
                                            </select>
                                    </div>
                                    <button className="btn btn-dark mt-3" onClick={handleNext}>
                                        Next
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {step === 2 && (
                    <div className="col-md-6">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h3>Step 2: Appointment Details</h3>
                                <div className="form-group">
                             <label>Preferred Date</label>
                             <input
                                        type="date"
                                        className={`form-control ${formData.preferredDate ? (isDateBooked(formData.preferredDate) ? "is-invalid" : "is-valid") : ""}`}
                                        name="preferredDate"
                                        value={formData.preferredDate}
                                        onChange={handleDateSelection}
                                        min={today}
                                        required
                                    />
                                        </div>

                                <div className="form-group">
                                    <label>Preferred Time</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        name="preferredTime"
                                        value={formData.preferredTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Enter location"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Purpose</label>
                                    <textarea
                                        className="form-control"
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Enter purpose of the appointment"
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="receiveNotifications"
                                        checked={formData.receiveNotifications}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label">Receive notifications</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="termsAccepted"
                                        checked={formData.termsAccepted}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label">Accept Terms and Conditions</label>
                                </div>
                                <button className="btn btn-dark mt-3" onClick={handlePrevious}>
                                    Previous
                                </button>
                                <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {step === 3 && (
                <div className="row mt-3">
                    <div className="col-md-6">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h3>Appointment Overview</h3>
                                {submittedData && (
                                    <>
                                        <ul className="list-group">
                                            <li className="list-group-item"><strong>Client Name:</strong> {submittedData.clientName}</li>
                                            <li className="list-group-item"><strong>Email:</strong> {submittedData.email}</li>
                                            <li className="list-group-item"><strong>Phone Number:</strong> {submittedData.phoneNumber}</li>
                                            <li className="list-group-item"><strong>Project Type:</strong> {submittedData.projectType}</li>
                                            <li className="list-group-item"><strong>Date:</strong> {submittedData.preferredDate}</li>
                                            <li className="list-group-item"><strong>Time:</strong> {submittedData.preferredTime}</li>
                                            <li className="list-group-item"><strong>Location:</strong> {submittedData.location}</li>
                                            <li className="list-group-item"><strong>Purpose:</strong> {submittedData.purpose}</li>
                                        </ul>
                                        <button className="btn btn-success mt-3" onClick={handleDownloadPDF}>
                                            Download PDF
                                        </button>
                                        <button className="btn btn-warning mt-3" onClick={handleUpdate}>
                                            Update
                                        </button>
                                        <button className="btn btn-danger mt-3" onClick={handleDelete}>
                                            Delete
                                        </button>
                                    </>
                                )}
                                {error && <div className="alert alert-danger mt-3">{error}</div>}
                                {message && <div className="alert alert-success mt-3">{message}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
