import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Ensure this line is present to include Bootstrap JS
import "./sidebar.css";

function Sidebar() {
    const sidebarStyle = {
        background: 'linear-gradient(180deg, #211C6A, #4137D0)',
        minHeight: '100vh', // Ensures the sidebar covers the full height of the viewport
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-auto col-sm-2 d-flex flex-column justify-content-between min-vh-100' style={sidebarStyle}>
                    <div className='mt-2'>
                        <a className='text-decoration-none d-flex align-items-center text-white d-none d-sm-inline' role = "button">
                            <span className='f5-4'>Project Manager</span>
                        </a>
                        <hr className='text-white d-none d-sm-block'></hr>
                        <ul className="nav nav-pills flex-column mt-2 mt-sm-0" id='parentM'>
                            
                            <li className="nav-item  my-3 py-2 py-sm-0">
                                <a href="#" className="nav-link text-white text-center text-sm-start" aria-current="page">
                                    <i className="bi bi-ui-checks-grid"></i>
                                    <span className='ms-2 d-none d-sm-inline'>Control Center</span>
                                </a>
                            </li>

                            <li className="nav-item  my-1 py-2 py-sm-0">
                                <a href="#submenu" className="nav-link text-white text-center text-sm-start" data-bs-toggle="collapse" aria-expanded="false">
                                    <i className="bi bi-house-gear"></i>
                                    <span className='ms-2 d-none d-sm-inline' >Project Hub</span>
                                    <i className="bi bi-caret-down-square-fill ms-0 ms-sm-3"></i>
                                </a>
                                <ul className="nav collapse ms-2 flex-column" id='submenu'>
                                    <li className="nav-item ">
                                        <a className="nav-link text-white" href="#" aria-current="page">
                                        <i class="bi bi-person-add"></i> <span className='d-none d-sm-inline'>Clients</span>
                                           
                                        </a>
                                    </li>
                                    <li className="nav-item ">
                                        <a className="nav-link text-white" href="#">
                                        <i class="bi bi-hourglass-split"></i><span className='d-none d-sm-inline'>Milestones</span>
                                        </a>
                                    </li>
                                    <li className="nav-item ">
                                        <a className="nav-link text-white" href="#">
                                        <i class="bi bi-calendar2-range-fill"></i><span style={{marginLeft: '5px',}} className='d-none d-sm-inline'>item3</span> 
                                        </a>
                                    </li>
                                </ul>  
                            </li>

                            <li className="nav-item  my-1 py-2 py-sm-0">
                                <a href="#" className="nav-link text-white text-center text-sm-start" aria-current="page">
                                    <i className="bi bi-calendar2-day"></i>
                                    <span className='ms-2 d-none d-sm-inline'>Daily Pulse</span>
                                </a>
                            </li>

                            <li className="nav-item  my-1 py-2 py-sm-0">
                                <a href="#" className="nav-link text-white text-center text-sm-start" aria-current="page">
                                    <i className="bi bi-calendar2-day"></i>
                                    <span className='ms-2 d-none d-sm-inline'>Vendor Vault</span>
                                </a>
                            </li>

                            <li className="nav-item my-1 py-2 py-sm-0">
                                <a href="#" className="nav-link text-white text-center text-sm-start" aria-current="page">
                                    <i className="bi bi-calendar2-day"></i>
                                    <span className='ms-2 d-none d-sm-inline'>Inspection</span>
                                </a>
                            </li>

                            <li className="nav-item my-1 py-2 py-sm-0">
                                <a href="#" className="nav-link text-white text-center text-sm-start" aria-current="page">
                                    <i className="bi bi-calendar2-day"></i>
                                    <span className='ms-2 d-none d-sm-inline'>Settings</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="dropdown open">
                        <a
                            className="btn btn-secondary dropdown-toggle text-white"
                            type="button"
                            id="triggerId"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <i className="bi bi-person-lines-fill "></i> <span style={{ marginLeft: '5px' }} className='fs-5 ms-3 d-none d-sm-inline'>Akashwaran</span>
                        </a>
                        <div className="dropdown-menu" aria-labelledby="triggerId">
                            <a className="dropdown-item" href="#">Profile</a>
                            <a className="dropdown-item disabled" href="#">Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
