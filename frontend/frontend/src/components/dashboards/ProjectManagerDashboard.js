import React, { useState } from 'react';
import Sidebar from '../sidebar';
import CreateInspectionForm from '../Cinspectionsschedule/createinspectionform';
import InspectionsDisplay from '../Cinspectionsschedule/InspectionsDisplay';

function ProjectManagerDashboard() {
    // State to track the active section in the sidebar
    const [activeSection, setActiveSection] = useState('');

    // Function to handle section change
    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    // Function to handle successful inspection creation
    const handleCreateInspectionSuccess = () => {
        setActiveSection('Inspection'); // Switch back to InspectionsDisplay
    };

    return (
        <div>
            <Sidebar
                role="Project Manager"
                userName="Akashwaran"
                onSectionChange={handleSectionChange}
            />
            
            <div style={{ paddingLeft: '220px', marginTop: '100px' }}>
                {/* Button to add an inspection */}
                {activeSection === 'Inspection' && (
                    <div style={{ padding: '20px' }}>
                        <button 
                            onClick={() => {
                                setActiveSection('CreateInspection');
                                console.log("Add Inspection clicked!"); // Debug log
                            }} 
                            style={{ 
                                marginBottom: '10px', 
                                
                                padding: '10px 20px', 
                                background: 'linear-gradient(250deg, #211C6A, #4137D0)',
                                borderRadius : '30px',
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '5px', 
                                boxShadow: '0 0 5px rgba(76, 175, 80, 0.5)', // Green glow
                                transition: 'box-shadow 0.3s ease-in-out',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.boxShadow = '0 0 20px rgba(76, 175, 80, 1)'; // Increased glow on hover
                            }}
                            onMouseOut={(e) => {
                                e.target.style.boxShadow = '0 0 5px rgba(76, 175, 80, 0.5)'; // Reset glow
                            }}
                        >
                            Add Inspection
                        </button>
                        <InspectionsDisplay onCreateSuccess={handleCreateInspectionSuccess} />
                    </div>
                )}

                {/* Conditionally render CreateInspectionForm */}
                {activeSection === 'CreateInspection' && (
                    <div style={{ padding: '20px' }}>
                        <CreateInspectionForm onSuccess={handleCreateInspectionSuccess} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectManagerDashboard;
