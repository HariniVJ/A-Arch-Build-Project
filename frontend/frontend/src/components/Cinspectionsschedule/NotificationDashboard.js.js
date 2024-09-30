import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button, Card, CardContent, Typography, List, ListItem, ListItemText } from "@mui/material";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const libraries = ["places"];
const mapContainerStyle = {
    width: "100%",
    height: "400px",
};
const defaultCenter = {
    lat: 6.927079,
    lng: 79.861244,
};

const QualityAssuranceDashboard = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedInspection, setSelectedInspection] = useState(null);
    const [mapVisible, setMapVisible] = useState(false);
    const [address, setAddress] = useState("");
    const [coordinates, setCoordinates] = useState(defaultCenter);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyALo0iLfpJAoXfW0ATzAdywDvXlH4xeLes",
        libraries,
    });
    
    const [mapInstance, setMapInstance] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await fetch("http://localhost:8000/inspection/notifications");
            const data = await response.json();
            setNotifications(data);
        };

        fetchNotifications();
    }, []);

    const handleViewDetails = (inspectionDetails) => {
        setSelectedInspection(inspectionDetails);
    };

    const handleHideDetails = () => {
        setSelectedInspection(null);
    };

    const handleSearchInMap = () => {
        setMapVisible(true);
    };

    const handleSelect = async (value) => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        setCoordinates(latLng);
        setAddress(value);
    };

    const shareLocation = () => {
        const shareLink = `https://www.google.com/maps/?q=${coordinates.lat},${coordinates.lng}`;
        navigator.clipboard.writeText(shareLink);
        alert("Location link copied to clipboard!");
    };

    // Send email functionality
    const sendEmail = () => {
        const emailSubject = "Location Link";
        const emailBody = `This is the link to be shared: https://www.google.com/maps/?q=${coordinates.lat},${coordinates.lng}`;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Notifications for Morgan
            </Typography>
            <List>
                {notifications.map((notification, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={notification.message}
                            secondary={dayjs(notification.date).format("MM/DD/YYYY HH:mm")}
                        />
                        <Button variant="contained" onClick={() => handleViewDetails(notification.inspectionDetails)}>
                            View
                        </Button>
                    </ListItem>
                ))}
            </List>

            {selectedInspection && (
                <Card variant="outlined" style={{ marginTop: "20px" }}>
                    <CardContent>
                        <Typography variant="h5">Inspection Details</Typography>
                        <Typography>Site Code: {selectedInspection.sitecode}</Typography>
                        <Typography>Project Name: {selectedInspection.projectname}</Typography>
                        <Typography>Title: {selectedInspection.ititle}</Typography>
                        <Typography>Type: {selectedInspection.itype}</Typography>
                        <Typography>Date: {selectedInspection.idate}</Typography>
                        <Typography>Time: {selectedInspection.itime}</Typography>
                        <Typography>Assignee: {selectedInspection.assignee}</Typography>
                        <Typography>Complexity: {selectedInspection.projectcomplexity}</Typography>
                        <Typography>Location: {selectedInspection.location}</Typography>
                        <Button variant="outlined" color="secondary" onClick={handleHideDetails} style={{ marginTop: "10px" }}>
                            Hide
                        </Button>
                        <Button variant="contained" onClick={handleSearchInMap} style={{ marginTop: "10px", marginLeft: "10px" }}>
                            Search in Map
                        </Button>
                    </CardContent>
                </Card>
            )}

            {mapVisible && (
                <div style={{ marginTop: "20px" }}>
                    <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <div style={{ position: "relative", marginBottom: "10px" }}>
                                    <i
                                        className="fas fa-search"
                                        style={{
                                            position: "absolute",
                                            left: "10px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#8a2be2",
                                        }}
                                    />
                                    <input
                                        {...getInputProps({ placeholder: "Enter a location..." })}
                                        style={{
                                            width: "80%",
                                            padding: "10px 40px",
                                            border: "1px solid #ccc",
                                            borderRadius: "20px",
                                            backgroundColor: "#e6e6fa",
                                        }}
                                    />
                                </div>
                                <div>
                                    {loading ? <div>Loading...</div> : null}
                                    {suggestions.map((suggestion) => {
                                        const style = {
                                            backgroundColor: suggestion.active ? "#fafafa" : "#ffffff",
                                            padding: "10px",
                                            cursor: "pointer",
                                        };
                                        return (
                                            <div {...getSuggestionItemProps(suggestion, { style })} key={suggestion.placeId}>
                                                {suggestion.description}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete>

                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={15}
                        center={coordinates}
                        onLoad={setMapInstance}
                    >
                        <Marker position={coordinates} />
                    </GoogleMap>

                    {/* Share Button */}
                    <button
                        onClick={shareLocation}
                        style={{
                            marginTop: '10px',
                            padding: '10px',
                            borderRadius: '5px',
                            backgroundColor: '#8a2be2',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Share Location
                    </button>

                    {/* Send Email Button */}
                    <button
                        onClick={sendEmail}
                        style={{
                            marginTop: '10px',
                            marginLeft: '10px',
                            padding: '10px',
                            borderRadius: '5px',
                            backgroundColor: '#4682B4',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Send Email
                    </button>
                </div>
            )}
        </div>
    );
};

export default QualityAssuranceDashboard;
