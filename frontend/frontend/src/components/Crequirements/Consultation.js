import { useState } from 'react';




export default function Consultation() {
  const [view, setView] = useState("form");
  const [currentStep, setCurrentStep] = useState(0); // Track the current step
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [dateOfConsultation, setDateOfConsultation] = useState("");
  const [conductedBy, setConductedBy] = useState("");
  const [projectGoals, setProjectGoals] = useState("");
  const [budgetConstraints, setBudgetConstraints] = useState("");
  const [regulatoryRequirements, setRegulatoryRequirements] = useState("");
  const [sustainabilityGoals, setSustainabilityGoals] = useState("");
  const [clientFeedback, setClientFeedback] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [aestheticPreferences, setAestheticPreferences] = useState({
    typeOfBuilding: "",
    approvedType: "",
    designStyle: "",
    roofType: "",
    wallMaterial: "",
    roofMaterial: "",
    doorWindowMaterial: "",
  });
  const [functionalRequirements, setFunctionalRequirements] = useState({
    masterBedroom: false,
    attachedBathroom: false,
    kitchen: false,
    pantry: false,
    terrace: false,
  });
  const [numberOfBedrooms, setNumberOfBedrooms] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [requirementsList, setRequirementsList] = useState([]);
  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const apiUrl = "http://localhost:8000/req";

  const handleSubmit = () => {
    setError("");

    if (
      projectName.trim() !== '' &&
      clientName.trim() !== '' &&
      dateOfConsultation.trim() !== '' &&
      conductedBy.trim() !== '' &&
      projectGoals.trim() !== '' &&
      budgetConstraints.trim() !== '' &&
      regulatoryRequirements.trim() !== '' &&
      sustainabilityGoals.trim() !== '' &&
      clientFeedback.trim() !== '' &&
      additionalNotes.trim() !== '' &&
      aestheticPreferences.typeOfBuilding.trim() !== '' &&
      selectedFloor.trim() !== ''
    ) {
      const dataToSubmit = {
        projectName,
        clientName,
        dateOfConsultation,
        conductedBy,
        projectGoals,
        budgetConstraints,
        aestheticPreferences,
        functionalRequirements: {
          ...functionalRequirements,
          numberOfBedrooms: selectedFloor === "firstFloor" ? numberOfBedrooms : "",
        },
        regulatoryRequirements,
        sustainabilityGoals,
        clientFeedback,
        additionalNotes,
        selectedFloor,
      };

      fetch(apiUrl + "/consultations", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Network response was not ok.');
          }
        })
        .then((data) => {
          setMessage("Requirement added successfully");
          setRequirementsList((prev) => [...prev, dataToSubmit]);
          setSubmittedData(dataToSubmit);
          setView("list");
          setTimeout(() => {
            setMessage("");
          }, 3000);
        })
        .catch((error) => {
          console.error('Fetch error:', error);
          setError("Unable to create Requirement");
        });
    } else {
      setError("Please fill all required fields.");
    }
  };

  const handleEdit = (index) => {
    const reqToEdit = requirementsList[index];
    setProjectName(reqToEdit.projectName);
    setClientName(reqToEdit.clientName);
    setDateOfConsultation(reqToEdit.dateOfConsultation);
    setConductedBy(reqToEdit.conductedBy);
    setProjectGoals(reqToEdit.projectGoals);
    setBudgetConstraints(reqToEdit.budgetConstraints);
    setRegulatoryRequirements(reqToEdit.regulatoryRequirements);
    setSustainabilityGoals(reqToEdit.sustainabilityGoals);
    setClientFeedback(reqToEdit.clientFeedback);
    setAdditionalNotes(reqToEdit.additionalNotes);
    setAestheticPreferences(reqToEdit.aestheticPreferences);
    setFunctionalRequirements(reqToEdit.functionalRequirements);
    setSelectedFloor(reqToEdit.selectedFloor);
    setNumberOfBedrooms(reqToEdit.functionalRequirements.numberOfBedrooms);

    setRequirementsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDelete = (index) => {
    setRequirementsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAestheticChange = (e) => {
    const { name, value } = e.target;
    setAestheticPreferences(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFunctionalChange = (e, name) => {
    const { checked } = e.target;
    setFunctionalRequirements(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleFloorSelection = (e) => {
    setSelectedFloor(e.target.value);
  };

  const handleBackToForm = () => {
    setView("form");
     
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1); // Move to the next step
    } else {
      handleSubmit(); // If on the last step, submit the form
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1); // Move to the previous step
    }
  };

  const handleBudgetChange = (e) => {
    setBudgetConstraints(e.target.value);
  };

  return (
    <>
      <div className="row p-3 text-light text-start" style={{ backgroundColor: '#59B4C3' }}>
        <h1>Consultation Page</h1>
      </div>
      <div className="container mt-3">
        {view === "form" ? (
          <div className="row text-start">
            <div className="col-12 mb-3">
              <h3>Add Requirements</h3>
              {message && <p className="text-success">{message}</p>}
              {error && <p className="text-danger">{error}</p>}
            </div>

            {/* Step 1: Project Details and Budget Constraints */}
            {currentStep === 0 && (
              <div className="col-12">
                <div className="form-group">
                  <input
                    placeholder="Project Name"
                    onChange={(e) => setProjectName(e.target.value)}
                    value={projectName}
                    className="form-control mb-2"
                    type="text"
                  />
                  <input
                    placeholder="Client Name"
                    onChange={(e) => setClientName(e.target.value)}
                    value={clientName}
                    className="form-control mb-2"
                    type="text"
                  />
                  <input
                    placeholder="Date Of Consultation"
                    onChange={(e) => setDateOfConsultation(e.target.value)}
                    value={dateOfConsultation}
                    className="form-control mb-2"
                    type="date"
                  />
                 <select
                 onChange={(e) => setConductedBy(e.target.value)}
                 value={conductedBy}
                 className="form-control mb-2 form-control-sm"
                  >
                <option value="" disabled>Select a member</option>
                <option value="Menon">Menon</option>
                <option value="Suji Wikramshingha">Suji Wikramshingha</option>
                <option value="Ranil Suriya">Ranil Suriya</option>
                <option value="Harshath">Harshath</option>
                </select>
                  <input
                    placeholder="Project Goals"
                    onChange={(e) => setProjectGoals(e.target.value)}
                    value={projectGoals}
                    className="form-control mb-2"
                    type="text"
                  />
                  <label htmlFor="budgetRange">Budget Constraints (Rs):</label>
                  <input
                    id="budgetRange"
                    type="range"
                    min="10000"
                    max="500000"
                    step="1000"
                    value={budgetConstraints}
                    onChange={handleBudgetChange}
                    className="form-range mb-2"
                    style={{ width: "100%" }}
                  />
                  <div className="d-flex justify-content-between">
                    <span>Rs.10,000</span>
                    <span>Rs.{budgetConstraints}</span>
                    <span>Rs.500,000</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Aesthetic Preferences and Floor Selection */}
            {currentStep === 1 && (
              <div className="col-12">
                <div className="form-group">
                  <select
                    name="typeOfBuilding"
                    onChange={handleAestheticChange}
                    value={aestheticPreferences.typeOfBuilding}
                    className="form-control mb-2 form-control-sm"
                  >
                    <option value="" disabled>Select Type Of Building</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="mixed-use">Mixed Use</option>
                  </select>

                   
              <select
                name="approvedType"
                value={aestheticPreferences.approvedType}
                onChange={handleAestheticChange}
                className="form-control mb-2"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Mixed-Use">Mixed-Use</option>
                <option value="Institutional">Institutional</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Public Infrastructure">Public Infrastructure</option>
                <option value="Temporary Structure">Temporary Structure</option>
                <option value="Renovation/Remodel">Renovation/Remodel</option>
                <option value="Heritage Conservation">Heritage Conservation</option>
                <option value="Special Permit">Special Permit</option>
              </select>

              <select
              name="designStyle"
              onChange={handleAestheticChange}
              value={aestheticPreferences.designStyle}
              className="form-control mb-2"
              >
              <option value="" disabled>Select a design style</option>
              <option value="Minimalist">Minimalist</option>
              <option value="Modern">Modern</option>
              <option value="Classic">Classic</option>
              <option value="Rustic">Rustic</option>
              <option value="Industrial">Industrial</option>
          </select>

          <select
                name="roofType"
                value={aestheticPreferences.roofType}
                onChange={handleAestheticChange}
                className="form-control mb-2"
              >
                <option value="">Select Roof Type</option>
                <option value="Flat">Flat</option>
                <option value="Gable">Gable</option>
                <option value="Hip">Hip</option>
                <option value="Mansard">Mansard</option>
              </select>


              <div>
                <h4>Select Wall Material</h4>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="wallMaterial"
                    value="Brick"
                    onChange={handleAestheticChange}
                  />
                  <label className="form-check-label">Brick</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="wallMaterial"
                    value="Wood"
                    onChange={handleAestheticChange}
                  />
                  <label className="form-check-label">Wood</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="wallMaterial"
                    value="Concrete"
                    onChange={handleAestheticChange}
                  />
                  <label className="form-check-label">Concrete</label>
                </div>
              </div>
              <div>
                <h4>Select Roof Material</h4>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="roofMaterial"
                    value="Shingles"
                    onChange={handleAestheticChange}
                  />
                  <label className="form-check-label">Shingles</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="roofMaterial"
                    value="Tiles"
                    onChange={handleAestheticChange}
                  />
                  <label className="form-check-label">Tiles</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="roofMaterial"
                    value="Metal"
                    onChange={handleAestheticChange}
                  />
                  <label className="form-check-label">Metal</label>
                </div>
              </div>
              <div>
                <h4>Select Door/Window Material</h4>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="doorWindowMaterial"
                    value="Aluminum"
                    onChange={(e) =>
                      handleAestheticChange(e, "doorWindowMaterial")
                    }
                  />
                  <label className="form-check-label">Aluminum</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="doorWindowMaterial"
                    value="Wood"
                    onChange={(e) =>
                      handleAestheticChange(e, "doorWindowMaterial")
                    }
                  />
                  <label className="form-check-label">Wood</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="doorWindowMaterial"
                    value="PVC"
                    onChange={(e) =>
                      handleAestheticChange(e, "doorWindowMaterial")
                    }
                  />
                  <label className="form-check-label">PVC</label>
                </div>
              </div>
                </div>
                <div className="form-group">
                  <label>Select Floor:</label>
                  <select
                    value={selectedFloor}
                    onChange={handleFloorSelection}
                    className="form-control mb-2"
                  >
                    <option value="" disabled>Select Floor</option>
                    <option value="groundFloor">Ground Floor</option>
                    <option value="firstFloor">First Floor</option>
                  </select>
                </div>
                {selectedFloor === "firstFloor" && (
                  <div className="form-group">
                    <label>Number of Bedrooms:</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={numberOfBedrooms}
                      onChange={(e) => setNumberOfBedrooms(e.target.value)}
                      className="form-control mb-2"
                    />
                  </div>
                )}
              </div>
            )}

               {currentStep === 2 && (
              <div className="col-12">
                <div className="form-group">
                 <h4>Functional Requirements:</h4>
      
                  <div className="form-check">
                    <label className="form-check-label">
                     <input
                      className="form-check-input"
                       type="checkbox"
                       checked={functionalRequirements.masterBedroom}
                       onChange={(e) => handleFunctionalChange(e, "masterBedroom")}
                      />
                     Master Bedroom
                    </label>
                    </div>

                  <div className="form-check">
                  <label className="form-check-label">
                   <input
                     className="form-check-input"
                     type="checkbox"
                     checked={functionalRequirements.attachedBathroom}
                    onChange={(e) => handleFunctionalChange(e, "attachedBathroom")}
                   />
                     Attached Bathroom
                 </label>
                 </div>

                  <div className="form-check">
                 <label className="form-check-label">
                     <input
                     className="form-check-input"
                     type="checkbox"
                    checked={functionalRequirements.kitchen}
                    onChange={(e) => handleFunctionalChange(e, "kitchen")}
                     />
                    Kitchen
                     </label>
                  </div>

      <div className="form-check">
        <label className="form-check-label">
          <input
            className="form-check-input"
            type="checkbox"
            checked={functionalRequirements.pantry}
            onChange={(e) => handleFunctionalChange(e, "pantry")}
          />
          Pantry
        </label>
      </div>

      <div className="form-check">
        <label className="form-check-label">
          <input
            className="form-check-input"
            type="checkbox"
            checked={functionalRequirements.terrace}
            onChange={(e) => handleFunctionalChange(e, "terrace")}
          />
          Terrace
        </label>
      </div>

    </div>
  

                <div className="form-group">
                  <input
                    placeholder="Regulatory Requirements"
                    onChange={(e) => setRegulatoryRequirements(e.target.value)}
                    value={regulatoryRequirements}
                    className="form-control mb-2"
                    type="text"
                  />
                  <input
                    placeholder="Sustainability Goals"
                    onChange={(e) => setSustainabilityGoals(e.target.value)}
                    value={sustainabilityGoals}
                    className="form-control mb-2"
                    type="text"
                  />
                  <input
                    placeholder="Client Feedback"
                    onChange={(e) => setClientFeedback(e.target.value)}
                    value={clientFeedback}
                    className="form-control mb-2"
                    type="text"
                  />
                  <input
                    placeholder="Additional Notes"
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    value={additionalNotes}
                    className="form-control mb-2"
                    type="text"
                  />
                </div>
              </div>
            )}

            <div className="col-12 mt-3 d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
              >
                Previous
              </button>
              <button
                className="btn btn-primary"
                onClick={handleNextStep}
              >
                {currentStep === 2 ? "Submit" : "Next"}
              </button>
            </div>
          </div>
        ) : (
          <div className="row" style={{ padding: '20px' }}>
  <div className="col-12">
    <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>Requirements List</h3>
    <ul style={{ listStyleType: 'none', padding: '0' }}>
      {requirementsList.map((req, index) => (
        <li key={index} style={{ marginBottom: '20px' }}>
          <div
            className="card"
            style={{
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px',
              padding: '20px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#3498db' }}>Project Name: {req.projectName}</h5>
              <p className="card-text"><strong>Client Name:</strong> {req.clientName}</p>
              <p className="card-text"><strong>Date of Consultation:</strong> {req.dateOfConsultation}</p>
              <p className="card-text"><strong>Conducted By:</strong> {req.conductedBy}</p>
              <p className="card-text"><strong>Project Goals:</strong> {req.projectGoals}</p>
              <p className="card-text"><strong>Budget Constraints:</strong> Rs.{req.budgetConstraints}</p>

              {/* Aesthetic Preferences */}
              <h6 style={{ marginTop: '15px', color: '#16a085' }}>Aesthetic Preferences:</h6>
              <p className="card-text"><strong>Type of Building:</strong> {req.aestheticPreferences.typeOfBuilding}</p>
              <p className="card-text"><strong>Approved Type:</strong> {req.aestheticPreferences.approvedType}</p>
              <p className="card-text"><strong>Design Style:</strong> {req.aestheticPreferences.designStyle}</p>
              <p className="card-text"><strong>Roof Type:</strong> {req.aestheticPreferences.roofType}</p>
              <p className="card-text"><strong>Wall Material:</strong> {req.aestheticPreferences.wallMaterial}</p>
              <p className="card-text"><strong>Roof Material:</strong> {req.aestheticPreferences.roofMaterial}</p>
              <p className="card-text"><strong>Door/Window Material:</strong> {req.aestheticPreferences.doorWindowMaterial}</p>

              {/* Functional Requirements */}
              <h6 style={{ marginTop: '15px', color: '#16a085' }}>Functional Requirements:</h6>
              <ul>
                {req.functionalRequirements.masterBedroom && <li>Master Bedroom</li>}
                {req.functionalRequirements.attachedBathroom && <li>Attached Bathroom</li>}
                {req.functionalRequirements.kitchen && <li>Kitchen</li>}
                {req.functionalRequirements.pantry && <li>Pantry</li>}
                {req.functionalRequirements.terrace && <li>Terrace</li>}
                {req.selectedFloor === 'firstFloor' && (
                  <li>Number of Bedrooms: {req.functionalRequirements.numberOfBedrooms}</li>
                )}
              </ul>

              {/* Additional Information */}
              <h6 style={{ marginTop: '15px', color: '#16a085' }}>Additional Details:</h6>
              <p className="card-text"><strong>Regulatory Requirements:</strong> {req.regulatoryRequirements}</p>
              <p className="card-text"><strong>Sustainability Goals:</strong> {req.sustainabilityGoals}</p>
              <p className="card-text"><strong>Client Feedback:</strong> {req.clientFeedback}</p>
              <p className="card-text"><strong>Additional Notes:</strong> {req.additionalNotes}</p>

              {/* Buttons */}
              <button
                onClick={() => handleEdit(index)}
                className="btn btn-warning btn-sm"
                style={{ marginRight: '10px' }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(index)} className="btn btn-danger btn-sm">
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
  <button
    onClick={handleBackToForm}
    className="btn btn-primary"
    style={{ marginTop: '20px', width: '100%' }}
  >
    Back to form
  </button>
</div>
        )}
      </div>
    </>
  );
}

