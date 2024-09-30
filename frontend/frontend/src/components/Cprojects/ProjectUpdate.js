import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProjectCreate.css';

export default function ProjectUpdate({ id, onEditSucess }) {
  
  const [projectname, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projecttype, setProjectType] = useState('');
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState(1);
  const [maxDuration, setMaxDuration] = useState(36);
  const [startdate, setStartdate] = useState("");
  const [projectstatus, setProjectStatus] = useState('Planned'); // Default value
  const [clientname, setClientname] = useState("");
  const [sitecode, setSiteCode] = useState('');
  const [teammembers, setTeammembers] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate();
  const apiUrl = "http://localhost:8000/project";

  useEffect(() => {
    if (!id) {
      setError("Project ID is not defined.");
      return;
    }

    console.log("Fetching project with ID:", id);
    
    fetch(`${apiUrl}/projects/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Project not found');
        }
        return res.json();
      })
      .then(data => {
        setProjectName(data.projectname);
        setDescription(data.description);
        setProjectType(data.projecttype);
        setLocation(data.location);
        setDuration(data.duration);
        setStartdate(data.startdate.split('T')[0]); // Format date to 'YYYY-MM-DD'
        setProjectStatus(data.projectstatus || 'Planned'); // Default to 'Planned' if undefined
        setClientname(data.clientname);
        setSiteCode(data.sitecode);
        setTeammembers(data.teammembers);
        handleProjectTypeChange({ target: { value: data.projecttype } }); // Set max duration
      })
      .catch(err => {
        console.error('Error fetching project:', err);
        setError(err.message);
      });
  }, [id]);

  const handleSubmit = () => {
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

    fetch(`${apiUrl}/projects/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectData)
    })
      .then(res => {
        if (res.ok) {
          setMessage("Project updated successfully!");
          onEditSucess();
          setTimeout(() => {
            setMessage("");
          }, 2000);
        } else {
          throw new Error("Unable to update project.");
        }
      })
      .catch(err => setError(err.message));
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

    // Adjust duration if it exceeds the max allowed duration
    if (duration > maxDuration) {
      setDuration(maxDuration);
    }
  };

  const handleCancel = () => {
    onEditSucess();
  };

  return (
    <>
      <div className="row p-3 bg-primary text-light">
        <h1>Projects</h1>
      </div>
      <div className="container mt-4">
        <div className="card p-4 shadow-sm" style={{ backgroundColor: '#f9f9f9', border: '2px solid #007bff' }}>
          <h3>Update Project</h3>
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
                required
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
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="projecttype">Project Type</label>
              <select
                id="projecttype"
                className="form-control"
                onChange={handleProjectTypeChange}
                value={projecttype}
                required
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
                required
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
                onChange={(e) => setDuration(e.target.value)}
                className="form-control-range"
              />
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
                required
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
                  onChange={(e) => setProjectStatus(e.target.value)}
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
                  onChange={(e) => setProjectStatus(e.target.value)}
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
                  onChange={(e) => setProjectStatus(e.target.value)}
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
                required
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
                placeholder="Enter number of team members"
                onChange={(e) => setTeammembers(e.target.value)}
                value={teammembers}
                className="form-control"
                type="number"
                required
              />
            </div>

            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-success" onClick={handleSubmit}>Update Project</button>
              <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
