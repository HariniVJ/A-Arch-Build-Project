// src/components/dashboards/ArchitectDashboard.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from '../sidebar';
import AppointmentCards from '../appointments/AppointmentCards'; // Adjust the path based on your project structure

function ArchitectDashboard() {
    return (
        <Router>
            <div>
                <Sidebar role="Architect" userName="Jordan" />
                <div className="main-content">
                    <h1>Welcome to the Architect Dashboard</h1>
                    <Switch>
                        <Route path="/site-visit-planner">
                            <AppointmentCards />
                        </Route>
                        {/* Add more routes for other sections if needed */}
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default ArchitectDashboard;
