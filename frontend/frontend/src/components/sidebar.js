import React from 'react';
import './sidebar.css'; // Correct path if the CSS file is in the same directory as sidebar.js
import { IonIcon } from '@ionic/react';
import { pieChartOutline, peopleOutline, receiptOutline, peopleCircleOutline, rocketOutline, heartHalfOutline, logOutOutline } from 'ionicons/icons';
import logo from '../assets/logobgremoved.png';



const Sidebar = () => {
    return (
        <div className="container">
            <div className="navigation">
                <ul>
                    <li>
                        <a href="#">
                            <span className="icon">
                             {/** */}    <img src={logo} alt="Company Logo" style={{ width: '80px', height: '80px' }} />
                            </span>
                            <span className="title">Project Manager</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span className="icon">
                                <IonIcon icon={pieChartOutline} />
                            </span>
                            <span className="title">Control Center</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span className="icon">
                                <IonIcon icon={peopleOutline} />
                            </span>
                            <span className="title">Project Hub</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span className="icon">
                                <IonIcon icon={receiptOutline} />
                            </span>
                            <span className="title">Daily Pulse</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span className="icon">
                                <IonIcon icon={peopleCircleOutline} />
                            </span>
                            <span className="title">Vendor Vault</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span className="icon">
                                <IonIcon icon={rocketOutline} />
                            </span>
                            <span className="title">Inspection</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span className="icon">
                                <IonIcon icon={heartHalfOutline} />
                            </span>
                            <span className="title">Profile</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span className="icon">
                                <IonIcon icon={logOutOutline} />
                            </span>
                            <span className="title">Logout</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
