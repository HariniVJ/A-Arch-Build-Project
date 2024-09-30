import React, { useState } from 'react';
import Sidebar from '../sidebar'; // Ensure this path is correct
import Consultation from '../Crequirements/Consultation'; // Ensure this path is correct
import ClientCards from '../Crequirements/client'; // Ensure this path is correct

function CRMDashboard() {
  const [activeSection, setActiveSection] = useState('Client Control');

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'Requirement Tracker':
        return <Consultation />;

      case 'Client Control':
        return <ClientCards onCreateReq={() => handleSectionChange('Requirement Tracker')} />;

      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div>
      <Sidebar
        role="CRM"
        userName="Taylor"
        onSectionChange={handleSectionChange}
      />
      <div style={{ paddingLeft: '220px', marginTop: '100px' }}>
        {renderActiveSection()}
      </div>
    </div>
  );
}

export default CRMDashboard;
