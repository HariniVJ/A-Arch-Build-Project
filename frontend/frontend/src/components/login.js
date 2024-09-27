import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import introvideo from './assets/introvideo.mp4';
import logo from './assets/logo.png'; // Import your logo image
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function LoginPage() {
    // Inline styles
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
    };

    const contentStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '600px',
        width: '1200px',
    };

    const videoWrapperStyle = {
        flex: 1,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '15px 0px 0px 15px',
    };

    const videoStyle = {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    };

    const cardStyle = {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        height: '100%',
    };

    const cardInnerStyle = {
        width: '100%',
        height: '100%',
        padding: '2rem',
        borderRadius: '0px 15px 15px 0px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        background: 'linear-gradient(250deg, #211C6A, #4137D0)',
        color: 'white',
    };

    const logoStyle = {
        display: 'block',
        margin: '0 auto 10px', // Center the logo and add margin below
        width: '150px', // Adjust the size of the logo
        height: 'auto',
    };

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await axios.post('http://localhost:3000/login', {
                username,
                password,
            });
            console.log(response.data);
            if (response.data.success) {
                // Check credentials and navigate accordingly
                if (username === 'Akash') {
                    navigate('/project-manager'); // Navigate to project manager
                } else if (username === 'Dayana') {
                    navigate('/architect'); // Navigate to architect
                }
            } else {
                alert(response.data.message); // Alert message from server
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred during login. Please try again.");
        }
    };

    return (
        <div style={containerStyle}>
            <div style={contentStyle}>
                <div style={videoWrapperStyle}>
                    <video style={videoStyle} autoPlay muted loop>
                        <source src={introvideo} type="video/mp4" />
                        Your browser does not support HTML5 video.
                    </video>
                </div>
                <div style={cardStyle}>
                    <div style={cardInnerStyle}>
                        <img src={logo} alt="Logo" style={logoStyle} />
                        <h3 className="card-title text-center mb-4">Welcome Back</h3>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="username">Username</label>
                                <input type="text" className="form-control" id="username" placeholder="Enter username" autoComplete='off' onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Password" autoComplete='off' onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" style={{ background: 'linear-gradient(180deg, #EFF396, #59B4C3)', color: 'black' }}>Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
