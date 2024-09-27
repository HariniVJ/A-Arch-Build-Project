import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { FaSearch } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';
import './dailyissues.css'

export default function Issue() {
    const [view, setView] = useState("list");
    const [sitecode, setSitecode] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [issuetitle, setIssuetitle] = useState("");
    const [issuedes, setIssuedes] = useState("");
    const [otherIssueTitle, setOtherIssueTitle] = useState("");
    const [assignedPersonOrTeam, setAssignedPersonOrTeam] = useState("");
    const [priorityLevel, setPriorityLevel] = useState("");
    const [status, setStatus] = useState("");
    const [impactOnSchedule, setImpactOnSchedule] = useState("");
    const [team, setTeam] = useState("");
    const [tasksCompleted, setTasksCompleted] = useState("");
    const [workIssues, setWorkIssues] = useState("");

    const [issues, setIssues] = useState([]);
    const [resolvedIssues, setResolvedIssues] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(null);
    const [showOtherTextbox, setShowOtherTextbox] = useState(false);
    const [notifyPM, setNotifyPM] = useState(false);
    const [issueCount, setIssueCount] = useState(0);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); 

    useEffect(() => {
        setSitecode("SC-" + Math.floor(Math.random() * 10000));
        setLocation("LOC-" + Math.floor(Math.random() * 10000));
        setDate(new Date().toISOString().split('T')[0]);
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            const response = await fetch("http://localhost:8000/issues");
            if (response.ok) {
                const data = await response.json();
                const resolved = data.filter(issue => issue.status === "Resolved");
                const unresolved = data.filter(issue => issue.status !== "Resolved");
                setIssues(unresolved);
                setResolvedIssues(resolved);
                setIssueCount(data.length);
            } else {
                setError("Failed to fetch issues.");
            }
        } catch (error) {
            setError("Failed to fetch issues.");
        }
    };

    const handleSubmit = async () => {
        setError("");
        setMessage("");

        const issueTitleToSubmit = issuetitle === "Other" ? otherIssueTitle : issuetitle;

        if (date && issueTitleToSubmit && issuedes && assignedPersonOrTeam && priorityLevel && status && impactOnSchedule && team && tasksCompleted && workIssues ) {
            const newIssue = {
                sitecode,
                location,
                date,
                issuetitle: issueTitleToSubmit,
                issuedes,
                assignedPersonOrTeam,
                priorityLevel,
                status,
                impactOnSchedule,
                team,
                tasksCompleted,
                workIssues,
                notifyPM
            };

            try {
                if (editId === null) {
                    const response = await fetch("http://localhost:8000/issues", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newIssue)
                    });
                    if (response.ok) {
                        const addedIssue = await response.json();
                        setIssues([...issues, addedIssue]);
                        setMessage("Issue added successfully");
                        setIssueCount(issueCount + 1);
                        if (notifyPM) {
                            alert("Notification sent to Project Manager!");
                        }
                    } else {
                        setError("Unable to create issue");
                    }
                } else {
                    const response = await fetch(`http://localhost:8000/issues/${editId}`, {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newIssue)
                    });
                    if (response.ok) {
                        const updatedIssue = await response.json();
                        setIssues(issues.map(issue => issue._id === editId ? updatedIssue : issue));
                        setMessage("Issue updated successfully");
                        setEditId(null);
                    } else {
                        setError("Unable to update issue");
                    }
                }
                setTimeout(() => setMessage(""), 3000);
                setView("list");
            } catch (error) {
                setError("Unable to process request");
            }
            clearForm();
        } else {
            setError("All fields are required.");
        }
    };

    const clearForm = () => {
        setDate(new Date().toISOString().split('T')[0]);
        setIssuetitle("");
        setIssuedes("");
        setOtherIssueTitle("");
        setAssignedPersonOrTeam("");
        setPriorityLevel("");
        setStatus("");
        setImpactOnSchedule("");
        setTeam("");
        setTasksCompleted("");
        setWorkIssues("");
        setShowOtherTextbox(false);
        setNotifyPM(false);
    };

    const handleIssueTypeChange = (e) => {
        const selectedValue = e.target.value;
        setIssuetitle(selectedValue);
        setShowOtherTextbox(selectedValue === "Other");
        if (selectedValue !== "Other") {
            setOtherIssueTitle("");
        }
    };

    const handleEdit = (issue) => {
        setEditId(issue._id);
        setSitecode(issue.sitecode);
        setLocation(issue.location);
        setDate(issue.date);
        setIssuetitle(issue.issuetitle);
        setIssuedes(issue.issuedes);
        setAssignedPersonOrTeam(issue.assignedPersonOrTeam);
        setPriorityLevel(issue.priorityLevel);
        setStatus(issue.status);
        setImpactOnSchedule(issue.impactOnSchedule);
        setTeam(issue.team);
        setTasksCompleted(issue.tasksCompleted);
        setWorkIssues(issue.workIssues);
        setNotifyPM(issue.notifyPM || false);
        setView("form");
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            fetch(`http://localhost:8000/issues/${id}`, {
                method: "DELETE"
            }).then(() => {
                setIssues(issues.filter(issue => issue._id !== id));
                setResolvedIssues(resolvedIssues.filter(issue => issue._id !== id));
                setMessage("Issue deleted successfully");
                setTimeout(() => setMessage(""), 3000);
                setIssueCount(issueCount - 1);
            }).catch(() => {
                setError("Unable to delete issue");
            });
        }
    };

    const handleResolve = async (issue) => {
        const updatedIssue = { ...issue, status: "Resolved" };

        try {
            const response = await fetch(`http://localhost:8000/issues/${issue._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedIssue)
            });
            if (response.ok) {
                const resolvedIssue = await response.json();
                setIssues(issues.filter(i => i._id !== issue._id));
                setResolvedIssues([...resolvedIssues, resolvedIssue]);
                setMessage("Issue marked as resolved");
                setTimeout(() => setMessage(""), 3000);
            } else {
                setError("Unable to resolve issue");
            }
        } catch (error) {
            setError("Unable to process request");
        }
    };

    const handleViewDetails = (issue) => {
        setSelectedIssue(issue);
        setView("details");
    };

    const generatePDF = () => {
        if (!selectedIssue) return;

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Issue Report", 20, 20);

        doc.setFontSize(12);
        doc.text(`Site Code: ${selectedIssue.sitecode}`, 20, 40);
        doc.text(`Location: ${selectedIssue.location}`, 20, 50);
        doc.text(`Date: ${selectedIssue.date}`, 20, 60);
        doc.text(`Issue Title: ${selectedIssue.issuetitle}`, 20, 70);
        doc.text(`Issue Description: ${selectedIssue.issuedes}`, 20, 80);
        doc.text(`Assigned Person/Team: ${selectedIssue.assignedPersonOrTeam}`, 20, 90);
        doc.text(`Priority Level: ${selectedIssue.priorityLevel}`, 20, 100);
        doc.text(`Status: ${selectedIssue.status}`, 20, 110);
        doc.text(`Impact on Schedule: ${selectedIssue.impactOnSchedule}`, 20, 120);
        doc.text(`Team: ${selectedIssue.team}`, 20, 130);
        doc.text(`Tasks that were completed by the team: ${selectedIssue.tasksCompleted}`, 20, 140);
        doc.text(`Overall Contribution to Team Today: ${selectedIssue.workIssues}`, 20, 150);

        doc.text(`Notify Project Manager: ${selectedIssue.notifyPM ? "Yes" : "No"}`, 20, 160);

        doc.save(`Issue_Report_${selectedIssue._id}.pdf`);
    };

    const renderForm = () => (
        <div className="container highlighted-form">
            <h1 className="custom-heading my-4">Daily Issues & Managing Issues & Delays</h1>
            {message && <p className="text-success">{message}</p>}
            {error && <p className="text-danger">{error}</p>}
            <div className="form-group">
                <input readOnly value={sitecode} className="form-control my-2" type="text" placeholder="Site Code" />
                <input readOnly value={location} className="form-control my-2" type="text" placeholder="Location" />
                <input onChange={(e) => setDate(e.target.value)} value={date} className="form-control my-2" type="date" />
                <select onChange={handleIssueTypeChange} value={issuetitle} className="form-control my-2">
                <option value="">Select Issue Type</option>
                    <option value="Safety Hazard">Safety Hazard</option>
                    <option value="Material Shortage">Material Shortage</option>
                    <option value="Labor Shortage">Labor Shortage</option>
                    <option value="Weather Delay">Weather Delay</option>
                    <option value="SID">Subcontractor/Vendor Delay</option>
                    <option value="USD">Utility Service Disruption</option>
                    <option value="Other">Other</option>
                </select>
                {showOtherTextbox && (
                    <input 
                        onChange={(e) => setOtherIssueTitle(e.target.value)} 
                        value={otherIssueTitle} 
                        className="form-control my-2" 
                        type="text" 
                        placeholder="Other Issue Title"
                    />
                )}
                <textarea 
                    onChange={(e) => setIssuedes(e.target.value)} 
                    value={issuedes} 
                    className="form-control my-2" 
                    placeholder="Issue Description"
                />
                <select onChange={(e) => setAssignedPersonOrTeam(e.target.value)} value={assignedPersonOrTeam} className="form-control my-2">
                    <option value="">Select a Project Manager</option>
                    <option value="Kawshaliya">Kawshaliya</option>
                    <option value="Ragul">Ragul</option>
                </select>


                      
                      <div className="priority-group my-2">
    <label>Priority Level:</label>
    <div className="priority-option">
        <input
            type="radio"
            name="priorityLevel"
            value="High"
            checked={priorityLevel === "High"}
            onChange={(e) => setPriorityLevel(e.target.value)}
            className="priority-input"
        />
        <label className="priority-label">High</label>
    </div>
    <div className="priority-option">
        <input
            type="radio"
            name="priorityLevel"
            value="Medium"
            checked={priorityLevel === "Medium"}
            onChange={(e) => setPriorityLevel(e.target.value)}
            className="priority-input"
        />
        <label className="priority-label">Medium</label>
    </div>
    <div className="priority-option">
        <input
            type="radio"
            name="priorityLevel"
            value="Low"
            checked={priorityLevel === "Low"}
            onChange={(e) => setPriorityLevel(e.target.value)}
            className="priority-input"
        />
        <label className="priority-label">Low</label>
    </div>
</div>

                <select onChange={(e) => setStatus(e.target.value)} value={status} className="form-control my-2">
                    <option value="">Select Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delayed">Delayed</option>
                </select>
                <textarea onChange={(e) => setImpactOnSchedule(e.target.value)} value={impactOnSchedule} className="form-control my-2" placeholder="Impact on Schedule" style={{ height: '80px' }} />

                    
            <select onChange={(e) => setTeam(e.target.value)} value={team} className="form-control my-2">
                <option value="">Select Team Name</option>
                <option value="Masonry Team">Masonry Team</option>
                <option value="Carpentry Team">Carpentry Team</option>
                <option value="Electrical Team">Electrical Team</option>
                <option value="Plumbing Team">Plumbing Team</option>
                <option value="HVAC Team">HVAC (Heating, Ventilation, and Air Conditioning) Team</option>
                <option value="Roofing Team">Roofing Team</option>
                <option value="Concrete Works Team">Concrete Works Team</option>
                <option value="Steel/Metal Works Team">Steel/Metal Works Team</option>
            </select>

            <textarea onChange={(e) => setTasksCompleted(e.target.value)} value={tasksCompleted} className="form-control my-2" placeholder="Enter the tasks completed by the team" style={{ height: '80px' }} />

            <select onChange={(e) => setWorkIssues(e.target.value)} value={workIssues} className="form-control my-2">
    <option value="">Overall Contribution to Team Today</option>
    <option value="Completed all assigned tasks">Completed all assigned tasks</option>
    <option value="Made significant progress">Made significant progress</option>
    <option value="Faced some challenges but progressed">Faced some challenges but progressed</option>
    <option value="Minimal contribution due to issues">Minimal contribution due to issues</option>
    <option value="No issues">No issues</option>
</select>


                <div className="checkbox-container">
                    <input 
                        type="checkbox" 
                        checked={notifyPM} 
                        onChange={() => setNotifyPM(!notifyPM)} 
                        className="form-check-input"
                    />
                    <label className="checkbox-label">Notify Project Manager</label>
                </div>
                <div className="button-container my-3">
                <button onClick={handleSubmit} className="btn btn-submit">Submit</button>
                <button onClick={() => setView("list")} className="btn btn-back">Back to List</button>
                </div>
            </div>
        </div>
    );

    const renderList = () => (
        <div className="container">
            <h1 className="custom-heading my-4">Track & Resolve Daily Issues</h1>
            <div className="input-group mb-3" style={{ maxWidth: '1262px' }}>
            <div className="input-group-prepend">
                <span className="input-group-text custom-icon-width"><FaSearch /></span>
            </div>
            <input 
                type="text" 
                placeholder="Search issues..." 
                className="form-control" 
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} 
            />
            </div>
            <div className="add">
            <button onClick={() => setView("form")} className="addbutton">Add New Issue</button>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h2>Unresolved Issues <FaBell style={{ color: '#74E291' }} /> ({issueCount - resolvedIssues.length})</h2>

                    <ul className="list-group">
                        {issues.filter(issue => 
                            issue.issuetitle.toLowerCase().includes(searchQuery) || 
                            issue.date.includes(searchQuery)
                        ).map(issue => (
                            <div key={issue._id} className="unresolved">
                                <strong>Title:</strong> {issue.issuetitle} <br />
                                <strong>Date:</strong> {issue.date} <br />
                                <div className="button-group">
                                <button onClick={() => handleViewDetails(issue)} className="btn btn-gray mt-2">View Details</button>
                                <button onClick={() => handleEdit(issue)} className="btn btn-warning mt-2 mx-2">Edit</button>
                                <button onClick={() => handleResolve(issue)} className="btn btn-success mt-2">Resolve</button>
                                <button onClick={() => handleDelete(issue._id)} className="btn btn-danger mt-2 mx-2">Delete</button>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
                <div className="col-md-6">
                    <h2 className="mt-4">Resolved Issues ({resolvedIssues.length})</h2>
                    <ul className="list-group">
                        {resolvedIssues.filter(issue => 
                            issue.issuetitle.toLowerCase().includes(searchQuery) || 
                            issue.date.includes(searchQuery)
                        ).map(issue => (
                            <div key={issue._id} className="resolved">
                                <strong>Title:</strong> {issue.issuetitle} <br />
                                <strong>Date:</strong> {issue.date} <br />
                                <div className="button-group">
                                <button onClick={() => handleViewDetails(issue)} className="btn btn-gray">View Details</button>
                                <button onClick={() => handleDelete(issue._id)} className="btn btn-danger">Delete</button>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
           
        </div>
    );

    const renderDetails = () => (
        
        
        <div className="mycontainer">
            <h1 class="card-title">Issue Details</h1>
            <div className="card">
            {selectedIssue && (
                 <div className="card-body">
                     <div className="card-row">
                    <p><strong>Site Code:</strong> {selectedIssue.sitecode}</p>
                    <p><strong>Location:</strong> {selectedIssue.location}</p>
                    <p><strong>Date:</strong> {selectedIssue.date}</p>
                    </div>
                    <div className="card-description">
                    <p><strong>Issue Title:</strong> {selectedIssue.issuetitle}</p>
                    <p><strong>Issue Description:</strong> {selectedIssue.issuedes}</p>
                    </div>
                    <div className="card-row">
                    <p><strong>Assigned Person/Team:</strong> {selectedIssue.assignedPersonOrTeam}</p>
                    <p><strong>Priority Level:</strong> {selectedIssue.priorityLevel}</p>
                    <p><strong>Status:</strong> {selectedIssue.status}</p>
                    </div>
                    <div className="card-priority">
                    <p><strong>Impact on Schedule:</strong> {selectedIssue.impactOnSchedule}</p>
                    </div>

                    <div className="card-team">
                    <p><strong>Team :</strong> {selectedIssue.team}</p>
                    <p><strong>Tasks completed by the team :</strong> {selectedIssue.tasksCompleted}</p>
                    <p><strong>Overall Contribution to Team Today:</strong> {selectedIssue.workIssues}</p>
                    </div>
                    
                    <div className="card-nofi">
                    <p><strong>Notify Project Manager:</strong> {selectedIssue.notifyPM ? "Yes" : "No"}</p>
                    </div>
                    <div className="card-buttons">
                    <button onClick={generatePDF} className="btn btn-gen">Generate PDF</button>
                    <button onClick={() => setView("list")} className="btn btn-secondary mt-2 mx-2">Back to List</button>
                    </div>
                    
                </div>
                
            )}
        </div>
        </div>
    );

    return (
        <>
        
            {view === "list" && renderList()}
            {view === "form" && renderForm()}
            {view === "details" && renderDetails()}
        </>
    );
}

