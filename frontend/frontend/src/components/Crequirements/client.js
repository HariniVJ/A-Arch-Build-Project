import React from 'react';
import { Card, CardContent, Typography, Button, Avatar, Grid } from '@mui/material';
import johnImage from '../assets/alex.png'; // Adjust the path as necessary
import janeImage from '../assets/riley.png';
import michaelImage from '../assets/morgan.png';


const clientList = [
  {
    id: 1,
    name: 'John Doe',
    contactNumber: '555-1234',
    dateOfConsultation: '2024-09-28',
    image: johnImage,
  },
  {
    id: 2,
    name: 'Jane Smith',
    contactNumber: '555-5678',
    dateOfConsultation: '2024-09-25',
    image: janeImage,
  },
  {
    id: 3,
    name: 'Michael Johnson',
    contactNumber: '555-8765',
    dateOfConsultation: '2024-09-27',
    image: michaelImage,
  },
  {
    id: 4,
    name: 'Emily Davis',
    contactNumber: '555-3456',
    dateOfConsultation: '2024-09-29',
    image: 'https://via.placeholder.com/150/FF33A1/FFFFFF?text=Emily',
  },
  {
    id: 5,
    name: 'William Brown',
    contactNumber: '555-6789',
    dateOfConsultation: '2024-09-24',
    image: 'https://via.placeholder.com/150/FFC300/FFFFFF?text=William',
  },
  {
    id: 6,
    name: 'Sophia Wilson',
    contactNumber: '555-9876',
    dateOfConsultation: '2024-09-30',
    image: 'https://via.placeholder.com/150/DAF7A6/FFFFFF?text=Sophia',
  },
];

const ClientCards = ({onCreateReq}) => {
  return (
    <Grid container spacing={3} direction="row" justifyContent="flex-start" style={{ padding: '20px' }}>
      {clientList.map((client) => (
        <Grid item xs={12} sm={6} md={4} key={client.id}>
          <Card
            sx={{
              maxWidth: 345,
              textAlign: 'center',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            <CardContent>
              <Avatar
                alt={client.name}
                src={client.image}
                sx={{ width: 80, height: 80, margin: '0 auto 20px' }}
              />
              <Typography variant="h6" gutterBottom>
                {client.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Contact:</strong> {client.contactNumber}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Date of Consultation:</strong> {client.dateOfConsultation}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: '20px', transition: '0.2s' }}
                onClick={() => onCreateReq()}
              >
                Add Requirements
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ClientCards;
