import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your components
import ProjectManagerDashboard from './components/dashboards/ProjectManagerDashboard';
import FinancialManagerDashboard from './components/dashboards/FinancialManagerDashboard';
import ArchitectDashboard from './components/dashboards/ArchitectDashboard';
import CRMDashboard from './components/dashboards/CRMDashboard';
import QualityAssuranceDashboard from './components/dashboards/QualityAssuranceDashboard';
import SiteManagerDashboard from './components/dashboards/SiteManagerDashboard';
import NavScrollExample from './components/navibar';

function App() {
    return (
        <Router>
            <div>
                {/* Navbar at the top */}
                <NavScrollExample />
                
                <div className="container-fluid">
                    <div className="row">
                        {/* Main content */}
                        <div className="col">
                            <Routes>
                                <Route path="/project-manager" element={<ProjectManagerDashboard />} />
                                <Route path="/financial-manager" element={<FinancialManagerDashboard />} />
                                <Route path="/architect" element={<ArchitectDashboard />} />
                                <Route path="/crm" element={<CRMDashboard />} />
                                <Route path="/quality-assurance" element={<QualityAssuranceDashboard />} />
                                <Route path="/site-manager" element={<SiteManagerDashboard />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
