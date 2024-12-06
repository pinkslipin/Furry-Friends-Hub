// import {
//     Avatar,
//     Box,
//     Button,
//     Container,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Typography
//   } from "@mui/material";
//   import React, { useEffect, useState } from "react";
//   import { useNavigate } from "react-router-dom";
//   import Header from './Header';
  
//   function PetAdoptionList() {
//     const navigate = useNavigate();
//     const [pets, setPets] = useState([]);
//     const [error, setError] = useState(null);
//     const [lastUpdate, setLastUpdate] = useState(Date.now());
//     const [viewAdopted, setViewAdopted] = useState(false);  // To toggle between pets with no owner and adopted pets
//     const user = JSON.parse(localStorage.getItem('user'));
  
//     const handleLogout = () => {
//       localStorage.removeItem('user');
//       navigate('/login');
//     };
  
//     useEffect(() => {
//       const fetchPets = async () => {
//         try {
//           const isVet = user?.role === 'VET';
//           const endpoint = isVet
//             ? "http://localhost:8080/api/pet/getAllPets"
//             : `http://localhost:8080/api/pet/owner/${user.ownerId}`;
  
//           const response = await fetch(endpoint, {
//             headers: {
//               'Accept': 'application/json',
//               'Content-Type': 'application/json'
//             },
//             cache: 'no-store'
//           });
  
//           if (!response.ok) {
//             throw new Error(`Failed to fetch pets: ${response.statusText}`);
//           }
  
//           const rawText = await response.text();
  
//           try {
//             const data = JSON.parse(rawText);
//             setPets(Array.isArray(data) ? data : []);
//           } catch (jsonError) {
//             console.error('Raw response:', rawText);
//             console.error('JSON parse error:', jsonError);
//             throw new Error('Invalid JSON response from server');
//           }
//         } catch (error) {
//           console.error("Error fetching pets:", error);
//           setError(error.message);
//           setPets([]);
//         }
//       };
  
//       if (user) {
//         fetchPets();
//       } else {
//         setError("Please log in to view pets");
//       }
//     }, [lastUpdate, user]);
  
//     const handleDelete = async (pid) => {
//       try {
//         const response = await fetch(`http://localhost:8080/api/pet/deletePet/${pid}`, {
//           method: 'DELETE',
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           }
//         });
  
//         if (!response.ok) {
//           throw new Error(`Failed to delete pet: ${response.statusText}`);
//         }
  
//         setPets(pets.filter((pet) => pet.pid !== pid));
//         setLastUpdate(Date.now());
//       } catch (error) {
//         console.error("Error deleting pet:", error);
//         setError(error.message);
//       }
//     };

//     const handleUpdateStatus = async (requestId, status) => {
//         try {
//           const response = await fetch(`http://localhost:8080/api/adoptionRequest/update/${requestId}`, {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ status }),
//           });
    
//           if (!response.ok) throw new Error(`Failed to update status: ${response.statusText}`);
//           setLastUpdate(Date.now());
//         } catch (error) {
//           console.error("Error updating status:", error);
//           setError(error.message);
//         }
//       };
  
//     if (error) {
//       return (
//         <Container maxWidth="lg" style={{ paddingTop: "2em" }}>
//           <Typography variant="h6" color="error" align="center">
//             {error}
//           </Typography>
//         </Container>
//       );
//     }
  
//     const isVet = user?.role === 'VET';
  
//     // Filter pets based on whether they have an owner or not, and if the adoption request is approved
//     const petsToDisplay = viewAdopted
//       ? pets.filter(pet => pet.adoptionRequests?.requestStatus === 'approved') // Show only adopted pets with approved requests
//       : pets.filter(pet => !pet.owner); // Show pets without owners
    
//     const pendingRequest = pets.adoptionRequests?.find(req => req.requestStatus === "pending");

//     return (
//       <>
//         <Header onLogout={handleLogout} user={user} />
//         <Container
//           maxWidth="lg"
//           style={{
//             fontFamily: "Poppins, sans-serif",
//             paddingTop: "5em",
//             paddingBottom: "2em",
//           }}
//         >
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//               <Typography variant="h4" style={{ color: "#125B9A", fontWeight: 600 }}>
//                 Pet Adoption List
//               </Typography>
//               <Box>
//                 <Button
//                   variant="contained"
//                   onClick={() => setViewAdopted(!viewAdopted)}
//                   sx={{
//                     backgroundColor: '#FFB800',
//                     '&:hover': { backgroundColor: '#f6a500' },
//                     borderRadius: '5px',
//                     color: 'white',
//                     padding: '8px 16px',
//                     marginRight: '10px'
//                   }}
//                 >
//                   {viewAdopted ? 'View Pets Without Owners' : 'View Adopted Pets'}
//                 </Button>
                
//                   <Button
//                     variant="contained"
//                     onClick={() => navigate('/pet-adoption-form')}
//                     sx={{
//                       backgroundColor: '#F05A7E',
//                       '&:hover': { backgroundColor: '#d64d6f' },
//                       borderRadius: '5px',
//                       color: 'white',
//                       padding: '8px 16px'
//                     }}
//                   >
//                     Add New Pet
//                   </Button>

//               </Box>
//             </Box>
  
//             <TableContainer component={Paper} style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
//               <Table>
//                 <TableHead style={{ backgroundColor: "#FFBE98" }}>
//                   <TableRow>
//                     <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Pet Image</TableCell>
//                     <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Pet Name</TableCell>
//                     <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Species</TableCell>
//                     <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Breed</TableCell>
//                     <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Age</TableCell>
//                     <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Weight</TableCell>
//                     <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Medical Conditions</TableCell>
//                     {isVet && <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Owner</TableCell>}
//                     <TableCell style={{ color: "#125B9A", fontWeight: 600 }}>Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {Array.isArray(petsToDisplay) && petsToDisplay.length > 0 ? (
//                     petsToDisplay.map((pet, index) => (
//                       <TableRow key={pet.pid} style={{ backgroundColor: index % 2 === 0 ? "#FFF5EC" : "white" }}>
//                         <TableCell>
//                           <Avatar
//                             src={pet.petImage || pet.imageUrl}
//                             alt={pet.petName}
//                             sx={{
//                               width: 60,
//                               height: 60,
//                               border: '2px solid #FFBE98'
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>{pet.petName}</TableCell>
//                         <TableCell>{pet.species}</TableCell>
//                         <TableCell>{pet.breed}</TableCell>
//                         <TableCell>{pet.age}</TableCell>
//                         <TableCell>{pet.weight}</TableCell>
//                         <TableCell>{pet.medRec}</TableCell>
//                         {isVet && (
//                           <TableCell>
//                           {pet.owner ? (
//                             `${pet.owner.fname} ${pet.owner.lname}`
//                           ) : pendingRequest ? (
//                             <Box>
//                               <Button
//                                 variant="outlined"
//                                 color="warning"
//                                 onClick={() => handleUpdateStatus(pendingRequest.requestId, "approved")}
//                                 style={{ marginRight: "5px" }}
//                               >
//                                 Approve
//                               </Button>
//                               <Button
//                                 variant="outlined"
//                                 color="error"
//                                 onClick={() => handleUpdateStatus(pendingRequest.requestId, "declined")}
//                               >
//                                 Decline
//                               </Button>
//                             </Box>
//                           ) : (
//                             "N/A"
//                           )}
//                         </TableCell>
//                         )}
//                         <TableCell>
//                           <Button
//                             variant="outlined"
//                             onClick={() => navigate(`/update-pet/${pet.pid}`)}
//                             style={{
//                               color: "#125B9A",
//                               borderColor: "#125B9A",
//                               marginRight: "10px",
//                               borderRadius: "5px",
//                             }}
//                           >
//                             Edit
//                           </Button>
//                           {isVet && user?.ownerId == null && (
//                             <Button
//                               variant="outlined"
//                               onClick={() => handleDelete(pet.pid)}
//                               style={{
//                                 color: "#F05A7E",
//                                 borderColor: "#F05A7E",
//                                 borderRadius: "5px",
//                               }}
//                             >
//                               Delete
//                             </Button>
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={isVet ? 9 : 8} align="center">
//                         <Typography variant="h6" color="textSecondary">
//                           No pets available
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>
//         </Container>
//       </>
//     );
//   }
  
//   export default PetAdoptionList;
  
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
} from '@mui/material';

const PetAdoptionList = () => {
  const [pets, setPets] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/pet/no-owner');
        setPets(response.data);
      } catch (error) {
        console.error('Error fetching pets:', error.response ? error.response.data : error.message);
        alert(`Error: ${error.response ? error.response.status : ''}`);
      }
    };

    const fetchAdoptionRequests = async () => {
      try {
        const response = await axios.get('/adoptionrequests/getAllRequests');
        setAdoptionRequests(response.data);
      } catch (error) {
        console.error('Error fetching adoption requests:', error.response ? error.response.data : error.message);
        alert(`Error: ${error.response ? error.response.status : ''}`);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchPets();
      await fetchAdoptionRequests();
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleRequestAction = async (requestId, action) => {
    try {
      await axios.put(
        `http://localhost:8080/api/furryfriendshubadoption/${action}Request/${requestId}`
      );
      alert(`Request ${action}ed successfully.`);
      // Refresh data
      const updatedPets = await axios.get('http://localhost:8080/api/pet/no-owner');
      const updatedRequests = await axios.get('/adoptionrequests/getAllRequests');
      setPets(updatedPets.data);
      setAdoptionRequests(updatedRequests.data);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error.response ? error.response.data : error.message);
      alert(`Error: ${error.response ? error.response.status : ''}`);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Pet Adoption Requests
      </Typography>
      <Grid container spacing={4}>
        {pets.map((pet) => {
          // Filter adoption requests for the current pet
          const petRequests = adoptionRequests.filter((request) => request.petId === pet.pid);

          return (
            <Grid item xs={12} sm={6} md={4} key={pet.pid}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {pet.petName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Species:</strong> {pet.species}<br />
                    <strong>Breed:</strong> {pet.breed}<br />
                    <strong>Age:</strong> {pet.age} years old<br />
                    <strong>Weight:</strong> {pet.weight} kg<br />
                    <strong>Medical Condition:</strong> {pet.medRec}
                  </Typography>
                </CardContent>
                <CardActions>
                  {petRequests.length > 0 ? (
                    petRequests.map((request) => (
                      <Box key={request.requestId} sx={{ width: '100%', mb: 1 }}>
                        <Typography variant="body2">
                          Request by Owner ID: {request.ownerId}
                        </Typography>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleRequestAction(request.requestId, 'approve')}
                          sx={{ mr: 1 }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleRequestAction(request.requestId, 'decline')}
                        >
                          Decline
                        </Button>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No adoption requests.
                    </Typography>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default PetAdoptionList;
