import React, { useState } from 'react';
import Sidebar from '../sidebar';
import CreateInspectionForm from '../Cinspectionsschedule/createinspectionform';

function ProjectManagerDashboard() {
    // State to track the active section in the sidebar
    const [activeSection, setActiveSection] = useState('');

    // Function to handle section change
    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <div>
            <Sidebar
                role="Project Manager"
                userName="Akashwaran"
                onSectionChange={handleSectionChange}
            />
            
            <div style={{ paddingLeft: '220px', marginTop: '10px' }}>
                {/* Conditionally render the form when the Inspections section is active */}
                {activeSection === 'Inspection' && (
                    <div style={{ padding: '20px' }}>
                        <CreateInspectionForm />
                    </div>
                )}
            </div>
            
        </div>
    );
}

export default ProjectManagerDashboard;
