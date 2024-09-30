import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import './ProjectRead.css';

export default function ProjectRead({onAddProject, onAddInspection, onEditProject}) {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const apiUrl = "http://localhost:8000/project";
    const navigate = useNavigate();
    
    const fetchProjects = async (page = 1, limit = 6, search = "") => {
        try {
            const response = await fetch(`${apiUrl}/projects?page=${page}&limit=${limit}&search=${search}`);
            if (!response.ok) {
                console.error(`Error: ${response.status} - ${response.statusText}`);
                throw new Error("Failed to fetch projects");
            }
            const data = await response.json();
            console.log('Fetched Projects:', data.data); // Log the data to check the filtered results
            setProjects(data.data);
        } catch (error) {
            console.error('Fetch Projects Error:', error);
            setError(error.message);
        }
    };
    

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSearch = () => {
        fetchProjects(1, 6, searchTerm); // Pass searchTerm to fetchProjects
    };

    const handleEdit = (id) => {
        onEditProject(id);
    };

    const handleBookInspection = (project) => {
        onAddInspection(project); // Pass the project object to the onAddInspection function
    };
    

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                const response = await fetch(`${apiUrl}/projects/${id}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    throw new Error("Failed to delete project");
                }
                setProjects(projects.filter(project => project._id !== id));
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h1 style={{ color: '#00008B'}}>Project Overview</h1>
            {/* Notification and Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card large-card" style={{ backgroundColor: '#f9d342', color: '#333' }}>
                        <i className="fa fa-bell icon"></i>
                        <div className="card-body">
                            <h5 className="card-title">Notifications</h5>
                           
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card large-card" style={{ backgroundColor: '#211C6A', color: '#fff' }}>
                        <i className="fa fa-users icon"></i>
                        <div className="card-body">
                            <h5 className="card-title">Total Clients</h5>
                            
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card large-card" style={{ backgroundColor: '#5DBB63', color: '#fff' }}>
                    <i className="fa fa-folder-open icon"></i>
                        <div className="card-body">
                            <h5 className="card-title">Total Projects</h5>
                            <p className="card-text">{projects.length} projects</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card large-card" style={{ backgroundColor: '#4137D0', color: '#fff' }}>
                    <i className="fa fa-plus icon"></i>
                        <div className="card-body">
                            <h5 className="card-title">Add New Project</h5>
                            <button className="btn btn-primary" onClick={onAddProject} style={{ background: '#59B4C3', borderColor: '#59B4C3',color: '#fff' }}>Create Project</button>
                        </div>
                    </div>
                </div>
            </div>

            {error && <p className="text-danger">{error}</p>}
            <div className="search-container my-3 d-flex">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control search-input" // Keep the search-input class for styling
                        placeholder="Search projects by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                    />
                </div>
                <button className="btn btn-primary search-btn" onClick={handleSearch}>
                    Search
                </button>
            </div>
            <div className="row">
                {projects.length > 0 ? (
                    projects.map(project => (
                        <div className="col-md-4 mb-3" key={project._id}>
                            <div className="card">
                            <button className="btn btn-secondary" style={{background: 'silver'}}  onClick={() => handleBookInspection(project)}>Add Inspection</button>
                                <div className="card-body">
                                    <h5 className="card-title">{project.projectname}</h5>
                                    <p className="card-text">{project.description}</p>
                                    <p className="card-text"><strong>Location:</strong> {project.location}</p>
                                    <p className="card-text"><strong>Duration:</strong> {project.duration} months</p>
                                    <p className="card-text"><strong>Status:</strong> {project.projectstatus}</p>
                                    <p className="card-text"><strong>Client Name:</strong> {project.clientname}</p>
                                    <p className="card-text"><strong>Start Date:</strong> {new Date(project.startdate).toLocaleDateString()}</p>
                                    <p className="card-text"><strong>Site Code:</strong> {project.sitecode}</p>
                                    <p className="card-text"><strong>Team Members:</strong> {project.teammembers}</p>
                                    
                                    <div className="button-container">
                                        <button className="btn btn-edit" onClick={() => handleEdit(project._id)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(project._id)}>Delete</button>
                                        

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">No projects available.</div>
                )}
            </div>
        </div>
    );
}
