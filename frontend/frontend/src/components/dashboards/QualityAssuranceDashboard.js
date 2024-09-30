// src/components/dashboards/QualityAssuranceDashboard.js

import React, { useState } from 'react';
import Sidebar from '../sidebar';
import NotificationDashboard from '../Cinspectionsschedule/NotificationDashboard.js';

function QualityAssuranceDashboard() {
     // State to track the active section in the sidebar
     const [activeSection, setActiveSection] = useState('Inspection Hub');

     // Function to handle section change
     const handleSectionChange = (section) => {
         setActiveSection(section);
     };
    return (
        <div>
            <Sidebar role="QA Inspector" userName="Morgan"  onSectionChange={handleSectionChange} />
            
            <div style={{ paddingLeft: '220px', marginTop: '100px' }}>
                {/* Conditionally render the form when the Inspections section is active */}
                {activeSection === 'Inspection Hub' && (
                    <div style={{ padding: '20px' }}>
                        <NotificationDashboard />
                    </div>
                )}
            </div>
          
        </div>
    );
}

export default QualityAssuranceDashboard;
