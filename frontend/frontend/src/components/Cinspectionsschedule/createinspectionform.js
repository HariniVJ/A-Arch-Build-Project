import React from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import BookmarkAddedTwoToneIcon from '@mui/icons-material/BookmarkAddedTwoTone';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { useNavigate } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './createinspection.css';

// Import images from assets folder
import akashwaranImg from '../assets/akashwaran.png';
import alexImg from '../assets/alex.png';
import rileyImg from '../assets/riley.png';
import morganImg from '../assets/morgan.png';





const initialValue = dayjs(); // Set the initial value to the current date


const inspectionTypes = [
    { label: 'Pre-Final Inspection', background: '#6256CA' }, // Example colors
    { label: 'Building Code Compliance Inspection', background: '#227B94' },
    { label: 'Design and Quality Assurance Inspection', background: '#125B9A' },
    { label: 'Client Walkthrough', background: '#179BAE' },
    { label: 'Final Punch List Inspection', background: '#1E2A5E' },
  ];
  
  
const assignees = [
  { name: 'Akashwaran', img: akashwaranImg },
  { name: 'Alex', img: alexImg },
  { name: 'Riley', img: rileyImg },
  { name: 'Morgan', img: morganImg },
];
const complexityOptions = [
  { label: 'High', value: 'high', icon: <StarIcon /> },
  { label: 'Medium', value: 'medium', icon: <StarHalfIcon /> },
  { label: 'Simple', value: 'simple', icon: <StarBorderIcon /> },
];





function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  const isSelected = !outsideCurrentMonth && highlightedDays.indexOf(day.date()) >= 0;

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}



export default function CreateInspectionForm({ onSuccess }) {
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);
  const [selectedDate, setSelectedDate] = React.useState(initialValue);
  const [selectedTime, setSelectedTime] = React.useState(dayjs()); // Set the clock to the current time
  const navigate = useNavigate();


  const [sitecode, setSideCode] = React.useState('');
  const [projectname, setProjectName] = React.useState('');
  const [ititle, setItitle] = React.useState('');
  const [itype, setInspectionType] = React.useState(inspectionTypes[0]);
  const [idate, setiDate] = React.useState(initialValue);
  const [itime, setiTime] = React.useState(dayjs()); // Set the clock to the current time
  const [assignee, setAssignee] = React.useState(assignees[0].name);
  const [projectcomplexity, setComplexity] = React.useState(complexityOptions[0].value);
  const [location, setLocation] = React.useState(''); // State for location input
  const [inslist, setinslist] = React.useState([]); 
  const apiUrl = "http://localhost:8000"


  const handleSubmit = () => {
    // Check if any required fields are empty
    if (
        sitecode.trim() === '' &&
        projectname.trim() === '' &&
        ititle.trim() === '' &&
        itype.trim() === '' &&
        idate.trim() === '' &&
        itime.trim() === '' &&
        assignee.trim() === '' &&
        projectcomplexity.trim() === '' &&
        location.trim() === ''
    ) {
        alert("Please fill in all required fields.");
        return; // Exit the function if any field is empty
    }

    fetch(apiUrl + "/createinspection", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sitecode, projectname, ititle, itype, idate, itime, assignee, projectcomplexity, location })
    })
    .then((res) => {
        if (res.ok) {
            // Add inspection to the list
            setinslist([...inslist, { sitecode, projectname, ititle, itype, idate, itime, assignee, projectcomplexity, location }]);
            navigate('/project-manager');
            onSuccess();
        } else {
            alert("Unable to create Inspection"); // Use an alert for errors
        }
    })
    .catch(error => {
        console.error("Error occurred during submission:", error);
        alert("An unexpected error occurred. Please try again."); // Handle fetch errors
    });
}


const fetchHighlightedDays = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/getHighlightedDays`);
      const data = await response.json();
      setHighlightedDays(data.days); // Assume your API returns an array of dates to highlight
    } catch (error) {
      console.error("Error fetching highlighted days:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHighlightedDays();
  }, []);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }
    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  const handleDateChange = (newDate) => {
    if (highlightedDays.includes(newDate.date())) {
        alert("This date is marked and cannot be selected.");
        return;
      }
      setSelectedDate(newDate); // Update the selected date state
      setiDate(newDate.format('YYYY-MM-DD')); // Update idate with formatted date
  };

  // Your handleTimeChange function
  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime); // Update the selected time state
    setiTime(newTime.format('HH:mm')); // Update itime with formatted time in 24-hour format
  };
  
  const handleComplexityChange = (event) => setComplexity(event.target.value);
  
  

  return (
    <div className="form-container">
      {/* Compartment 1 */}
      <div className="compartment compartment-1">
        <h2>Project Details</h2>
        <TextField
          fullWidth
          label="Project Name"
          variant="outlined"
          margin="normal"
          value={projectname}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Site Code"
          variant="outlined"
          margin="normal"
          value={sitecode}
          onChange={(e) => setSideCode(e.target.value)}
        />
        <TextField
          fullWidth
          label="Location" // New input field for location
          variant="outlined"
          margin="normal"
          value={location}
          onChange={(e) => setLocation(e.target.value)} // Update location state
        />
        <div className="complexity-container">
          <span>Complexity</span>
          <RadioGroup
            aria-label="complexity"
            name="complexity"
            value={projectcomplexity}
            onChange={handleComplexityChange}
            style={{ display: 'flex', flexDirection: 'row' }} // Horizontally align the radio buttons
          >
            {complexityOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {option.icon} {/* Render the icon */}
                    <span style={{ marginLeft: '8px' }}>{option.label}</span> {/* Label next to icon */}
                  </div>
                }
              />
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Compartment 2 */}
      <div className="compartment compartment-2">
        <h2>Inspection Details</h2>
        <TextField
          fullWidth
          label="Inspection Title"
          variant="outlined"
          margin="normal"
          value={ititle}
          onChange={(e) => setItitle(e.target.value)} 
        />
       <TextField
            select
            fullWidth
            label="Inspection Type"
            value={itype}
            onChange={(e) => setInspectionType(e.target.value)}
            margin="normal"
        >
            {inspectionTypes.map((type) => (
                <MenuItem 
                key={type.label} 
                value={type.label}
                style={{ backgroundColor: type.background, color: '#fff' }} // Apply the background color and optional text color
                >
                {type.label}
                </MenuItem>
            ))}
            </TextField>


      </div>

      {/* Compartment for Calendar and Clock */}
      <div className="calendar-clock-container">
        {/* Compartment - Calendar */}
        <div className="compartment compartment-calendar">
          <h2>Date</h2>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              orientation="portrait"
              loading={isLoading}
              onMonthChange={handleMonthChange}
              onChange={handleDateChange}
              renderLoading={() => <DayCalendarSkeleton />}
              value={selectedDate}
              slots={{
                day: ServerDay,
              }}
              slotProps={{
                day: { highlightedDays },
              }}
              shouldDisableDate={(date) => {
          const today = dayjs().startOf('day'); // Get today's date at midnight
          return date.isBefore(today); // Disable if the date is before today
        }}
            />
          </LocalizationProvider>
        </div>

        {/* Compartment - Clock (Static Time Picker) */}
        <div className="compartment compartment-clock">
          <h2>Time</h2>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticTimePicker
              displayStaticWrapperAs="desktop"
              value={selectedTime}
              onChange={handleTimeChange}
            />
          </LocalizationProvider>

          {/* Box to display the selected time */}
          <div className="selected-time-box">
            <p>Selected Time:</p>
            <p>{selectedTime.format('hh:mm A')}</p>
          </div>
        </div>
      </div>

      {/* Compartment 4 */}
      <div className="compartment compartment-4">
        <h2>Assign To</h2>
        <TextField
          select
          fullWidth
          label="Assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          margin="normal"
        >
          {assignees.map(({ name, img }) => (
            <MenuItem key={name} value={name}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={img} alt={name} style={{ borderRadius: '50%', width: '30px', height: '30px', marginRight: '8px' }} />
                {name}
              </div>
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* Submit Button */}
      <Button 
        variant="contained" 
        color="primary" 
        size="large" 
        style={{ marginTop: '20px' }} 
        startIcon={<BookmarkAddedTwoToneIcon />}
        onClick={handleSubmit}
      >
        Create Inspection
      </Button>
    </div>
  );
}
