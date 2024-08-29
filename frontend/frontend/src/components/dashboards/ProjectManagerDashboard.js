import React, { useState } from 'react';
import Sidebar from '../sidebar';
import CreateInspectionForm from '../Cinspectionsschedule/createinspectionform';


function ProjectManagerDashboard() {
    // State to track the active section in the sidebar
    const [activeSection, setActiveSection] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Function to handle section change
    const handleSectionChange = (section) => {
        setActiveSection(section);
        setShowForm(false); // Hide the form when section changes
    };

    // Function to handle button click to show the form
    const handleButtonClick = () => {
        setShowForm(true);
    };

    return (
        <div>
            <Sidebar
                role="Project Manager"
                userName="Akashwaran"
                onSectionChange={handleSectionChange}
            />
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                {/* Conditionally render the button when the Inspections section is active */}
                {activeSection === 'Inspection' && (
                    <button onClick={handleButtonClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
                        Book Inspection
                    </button>
                )}
                
                {/* Conditionally render the form when the button is clicked */}
                {showForm && <CreateInspectionForm />}
            </div>
        </div>
    );
}

export default ProjectManagerDashboard;
