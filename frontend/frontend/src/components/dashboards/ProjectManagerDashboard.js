import React, { useState } from 'react';
import Sidebar from '../sidebar';
import CreateInspectionForm from '../Cinspectionsschedule/createinspectionform';
import InspectionsDisplay from '../Cinspectionsschedule/InspectionsDisplay';
import ProjectRead from '../Cprojects/ProjectRead';
import ProjectCreate from '../Cprojects/ProjectCreate';
import ProjectUpdate from '../Cprojects/ProjectUpdate';



function ProjectManagerDashboard() {
    // State to track the active section in the sidebar
    const [activeSection, setActiveSection] = useState('Project Hub'); // Default to Project Hub
    const [selectedProjectId, setSelectedProjectId] = useState(null); // Store the project ID to edit

    // Function to handle section change
    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    // Function to handle successful inspection creation
    const handleCreateInspectionSuccess = () => {
        setActiveSection('Inspection'); // Switch back to InspectionsDisplay
    };

     // Function to handle project editing
     const handleEditProject = (projectId) => {
        setSelectedProjectId(projectId); // Store the selected project ID
        setActiveSection('ProjectUpdate'); // Switch to ProjectUpdate section
    };

    const handleCreateProjectSuccess = () => {
        setActiveSection('Project Hub'); // Switch back to ProjectRead after project creation
    };

    const handleEditProjectSuccess = () => {
        setActiveSection('Project Hub'); // Switch back to ProjectRead after project creation
    };

    const handleAddInspection = () => {
    setActiveSection('CreateInspection');
};




  

    // Function to render the appropriate component based on the active section
    const renderActiveSection = () => {
        switch (activeSection) {
            case 'Inspection':
                return (
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
                                borderRadius: '30px',
                                color: 'white',
                                border: 'none',
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
                );
            case 'CreateInspection':
                return (
                    <div style={{ padding: '20px' }}>
                        <CreateInspectionForm onSuccess={handleCreateInspectionSuccess} />
                    </div>
                );
            
            case 'Project Hub':
                    return (
                        <div style={{ padding: '20px' }}>
                             <ProjectRead onAddProject={() => setActiveSection('CreateProject')} onEditProject={handleEditProject} onAddInspection={() => setActiveSection('CreateInspection')} />
                        </div>
                    );
            case 'ProjectUpdate':
                    return (
                        <div style={{ padding: '20px' }}>
                            {/* Pass the selected project ID to ProjectUpdate */}
                            <ProjectUpdate id={selectedProjectId}  onEditSucess={handleEditProjectSuccess}/>
                        </div>
                    );
            case 'CreateProject':
                    return (
                         <div style={{ padding: '20px' }}>
                            {/* Pass the function to switch back to ProjectRead after project creation */}
                            <ProjectCreate onCreateSuccess={handleCreateProjectSuccess} />
                        </div>
                    );           
          
           



            // Add more cases for additional sections as needed
            default:
                return <div>Select a section from the sidebar</div>;
        }
    };

    return (
        <div>
            <Sidebar
                role="Project Manager"
                userName="Akashwaran"
                onSectionChange={handleSectionChange}
            />

            <div style={{ paddingLeft: '220px', marginTop: '100px' }}>
                {renderActiveSection()}
            </div>
        </div>
    );
}

export default ProjectManagerDashboard;
