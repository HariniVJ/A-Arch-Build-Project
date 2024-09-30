import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectCreate.css'

const generateSiteCode = () => {
  return 'SITE-' + Math.random().toString(36).substr(2, 8).toUpperCase();
};

export default function ProjectCreate({onCreateSuccess }) {
  const [projectname, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projecttype, setProjectType] = useState('');
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState(1);
  const [maxDuration, setMaxDuration] = useState(36);
  const [startdate, setStartdate] = useState("");
  const [projectstatus, setProjectStatus] = useState('');
  const [clientname, setClientname] = useState("");
  const [sitecode, setSiteCode] = useState('');
  const [teammembers, setTeammembers] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();
  const apiUrl = "http://localhost:8000/project";

  const isFormValid = () => {
    return projectname.trim() !== '' &&
      description.trim() !== '' &&
      projecttype !== '' &&
      location.trim() !== '' &&
      duration >= 1 && duration <= maxDuration &&
      startdate.trim() !== '' &&
      projectstatus !== '' &&
      clientname.trim() !== '' &&
      teammembers > 0; // Removed image check
  };

  const handleSubmit = () => {
    console.log({
      projectname,
      description,
      projecttype,
      location,
      duration,
      startdate,
      projectstatus,
      clientname,
      sitecode,
      teammembers,
    });

    setError("");
    if (!isFormValid()) {
      setError("Please fill in all required fields.");
      return;
    }

    const projectData = {
      projectname,
      description,
      projecttype,
      location,
      duration,
      startdate,
      projectstatus,
      clientname,
      sitecode,
      teammembers,
    };

    fetch(apiUrl + '/projects', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json' // Sending JSON data instead of FormData
      },
      body: JSON.stringify(projectData) // Use JSON for the request body
    })
      .then((res) => {
        if (res.ok) {
          setProjects([...projects, projectData]);
          setMessage("Item added successfully!");
          onCreateSuccess();
          setTimeout(() => {
            setMessage("");
          }, 2000);
        } else {
          setError("Unable to create project.");
        }
      })
      .catch(() => setError("Unable to create project"));
  };

  useEffect(() => {
    setSiteCode(generateSiteCode());
  }, []);

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleProjectTypeChange = (e) => {
    const selectedType = e.target.value;
    setProjectType(selectedType);

    switch (selectedType) {
      case 'Commercial':
        setMaxDuration(18);
        break;
      case 'Residential':
        setMaxDuration(12);
        break;
      case 'Infrastructure':
        setMaxDuration(36);
        break;
      case 'Renovation':
        setMaxDuration(12);
        break;
      case 'Industrial':
        setMaxDuration(36);
        break;
      default:
        setMaxDuration(36);
        break;
    }

    if (duration > maxDuration) {
      setDuration(maxDuration);
    }
  };

  const handleProjectStatusChange = (e) => {
    setProjectStatus(e.target.value);
  };

  const handleCancel = () => {
    navigate('/projects'); // Navigate back to ProjectList
  };

  return (
    <>
      <div className="container mt-4">
        <div className="card p-4 shadow-sm" style={{ backgroundColor: '#f9f9f9', border: '2px solid #007bff' }}>
          <h3>Add Project</h3>
          {message && <p className="text-success">{message}</p>}
          {error && <p className="text-danger">{error}</p>}
          <form>
            <div className="form-group mb-3">
              <label htmlFor="projectname">Project Name</label>
              <input
                id="projectname"
                placeholder="Enter project name"
                onChange={(e) => setProjectName(e.target.value)}
                value={projectname}
                className="form-control"
                type="text"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                placeholder="Enter project description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="form-control"
                type="text"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="projecttype">Project Type</label>
              <select
                id="projecttype"
                className="form-control"
                onChange={handleProjectTypeChange}
                value={projecttype}
              >
                <option value="">Select Project Type</option>
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Renovation">Renovation</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                placeholder="Enter project location"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
                className="form-control"
                type="text"
              />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="duration">Duration (months)</label>
                <input
                  id="duration"
                  type="range"
                  min="1"
                  max={maxDuration}
                  value={duration}
                  onChange={handleDurationChange}
                  className="form-control-range"
                  disabled={!projecttype}  // Disable input if no project type is selected
                />
                {!projecttype && <p className="text-danger">Please select a project type first.</p>}
                {projecttype && <p className="text-info">Max duration for {projecttype}: {maxDuration} months</p>}
                <div className="mt-2">Selected Duration: {duration} months</div>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="startdate">Start Date</label>
              <input
                id="startdate"
                placeholder="Select start date"
                onChange={(e) => setStartdate(e.target.value)}
                value={startdate}
                className="form-control"
                type="date"
              />
            </div>

            <fieldset className="form-group mb-3">
              <legend>Project Status</legend>
              <div className="form-check">
                <input
                  type="radio"
                  id="status-planned"
                  name="projectstatus"
                  value="Planned"
                  checked={projectstatus === 'Planned'}
                  onChange={handleProjectStatusChange}
                  className="form-check-input"
                />
                <label htmlFor="status-planned" className="form-check-label">Planned</label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  id="status-in-progress"
                  name="projectstatus"
                  value="In Progress"
                  checked={projectstatus === 'In Progress'}
                  onChange={handleProjectStatusChange}
                  className="form-check-input"
                />
                <label htmlFor="status-in-progress" className="form-check-label">In Progress</label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  id="status-completed"
                  name="projectstatus"
                  value="Completed"
                  checked={projectstatus === 'Completed'}
                  onChange={handleProjectStatusChange}
                  className="form-check-input"
                />
                <label htmlFor="status-completed" className="form-check-label">Completed</label>
              </div>
            </fieldset>

            <div className="form-group mb-3">
              <label htmlFor="clientname">Client Name</label>
              <input
                id="clientname"
                placeholder="Enter client name"
                onChange={(e) => setClientname(e.target.value)}
                value={clientname}
                className="form-control"
                type="text"
              />
            </div>

            <div className="form-group mb-3">
              <label>Site Code</label>
              <input
                disabled
                value={sitecode}
                className="form-control"
                type="text"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="teammembers">Number of Team Members</label>
              <input
                id="teammembers"
                type="number"
                min="1"
                value={teammembers}
                onChange={(e) => setTeammembers(parseInt(e.target.value))}
                className="form-control"
              />
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Add Project</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
