import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Button,
    Typography, Box, Alert, AlertTitle
} from '@mui/material';
import Modal from '@mui/material/Modal';
import { Divider } from '@mui/material';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import findClubChanges from "../scripts/SimulateBooking";
import ConfirmChoicesDialogue from "./ConfirmChoicesDialogue";


export function ClubModal({ open, handleClose, term, day, availableClubs, clubSelections, setClubSelections, setAvailableClubs }) {

    const [changeInfoModalOpen, setChangeInfoModalOpen] = useState(false);
    const [selectedChangeInfo, setSelectedChangeInfo] = useState({});
    const [selectedInstanceToBook, setSelectedInstanceToBook] = useState(null);

    const filteredClubs = Object.values(availableClubs).filter(
        club => club.club_instances
            .some(instance => instance.half_term === term && instance.day_of_week === day)
    );

    const alreadySelectedAsIds = clubSelections.flatMap(
        obj => Object.values(obj).map(day => day && day.id).filter(Boolean)
    );

    return (
        <Modal
            open={open}
            onClose={() => handleClose(false)}
            aria-labelledby="club-modal-title"
            aria-describedby="club-modal-description"
        >
            <Box
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80vw',
                    height: '80vh',
                    backgroundColor: 'white',
                    boxShadow: 24,
                    padding: '20px',
                    // overflowY: 'auto',
                }}
            >

                <div className="flex justify-center items-baseline">
                    <h2 id="club-modal-title" className='justify-center font-bold text-4xl'>
                        Select your club for {day}, Term {term}.
                    </h2>
                    
                </div>

                <div className="flex justify-center">
                    
                </div>

                <Divider style={{ margin: '20px 0px' }} />

                <Box style={{ marginBottom: '20px', padding: "0px 20px" }}>

                </Box>

                <Box display="flex" justifyContent="space-between" padding={"20px"} >
                    <Box flex={0.7}
                        style={{ 
                            maxHeight: '65vh', // adjust the height according to your needs
                            overflowY: 'auto',
                            paddingRight: 10
                          }}
                    >
                        {filteredClubs.map(club => {

                            const instance = club.club_instances.filter(instance => instance.day_of_week == day && instance.half_term == term)[0];
                            const isDisabled = alreadySelectedAsIds.some(id => instance.id === id);

                            return (
                                <Box key={club.id} style={{ margin: '20px 0', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }} className="shadow-lg">
                                    <div className="flex justify-between items-baseline">
                                        <div className="flex items-baseline gap-4">
                                            
                                            <h2 className='text-4xl font-bold ' style={{ minWidth: "500px" }}>{club.name}</h2>

                                            <div className="flex gap-2 items-baseline">
                                                <Typography variant="body2">{instance.day_of_week} </Typography>
                                                {/* <Typography variant="body2">Term {instance.half_term}</Typography>
                                                <Typography variant="body2">id {instance.id}</Typography> */}


                                            </div>

                                        </div>
                                        
                                        <div className="flex gap-2 items-baseline">
                                            
                                            <h2>
                                                {club.is_paid ?
                                                    <FontAwesomeIcon icon={faDollarSign} className='text-red-600' /> : ""}
                                            </h2>

                                            <Divider orientation="vertical" flexItem style={{ margin: '0 10px' }} />

                                            <h2 className='text-xl font-semibold'>
                                                <em>{instance.capacity} spaces left</em>
                                            </h2>
                                        </div>
                                    </div>
                                    <Divider style={{ margin: '10px 0' }} />

                                    <div className="flex">
                                        <div className='flex flex-col gap-3' style={{ width: "80%" }}>
                                            <p className="text-xl">{club.description}</p>
                                            <Typography variant="body2">Rules: <em>{club.rule}</em></Typography>
                                        </div>

                                        
                                    </div>

                                    

                                    <Divider style={{ margin: '10px 0' }} />

                                    <div className="flex justify-between items-baseline">

                                    <div>
                                    {
                                        alreadySelectedAsIds.some(id => instance.id == id) ?
                                                <Alert severity="success" >
                                                    <p className="font-bold">You already have a place on this club for this day!</p>
                                                </Alert>
                                            :
                                                <div></div>
                                    }

{alreadySelectedAsIds.some(id => instance.incompatible_club_ids.includes(id)) ?
                                            <Alert severity='warning' title="hey">
                                                <AlertTitle>
                                                    <strong>Warning!</strong>
                                                </AlertTitle>
                                                
                                                <em>Wording for when choosing this club is in violation of a rule.</em>

                                            </Alert>
                                            :
                                            <div></div>
                                        }
                                    </div>
                                    <Button
                                        style={{ marginTop: '10px' }}
                                        variant="outlined"
                                        disabled={isDisabled}  // Disable the button conditionally

                                        onClick={async () => {
                                            try {
                                                const changeInfo = await findClubChanges(instance.id);
                                                setSelectedChangeInfo(changeInfo.data);
                                                setSelectedInstanceToBook(instance.id);
                                                setChangeInfoModalOpen(true);
                                            } catch (error) {
                                                console.error("Error fetching change info:", error);
                                            }
                                        }}
                                    >
                                        Select
                                    </Button>

                                    
                                    </div>


                                </Box>
                            );
                        })}
                    </Box>

                    <ConfirmChoicesDialogue 
                        changeInfoModalOpen={changeInfoModalOpen}
                        selectedChangeInfo={selectedChangeInfo}
                        selectedInstanceToBook={selectedInstanceToBook}
                        setChangeInfoModalOpen={setChangeInfoModalOpen}
                        handleClose={handleClose}
                        setAvailableClubs={setAvailableClubs}
                        setClubSelections={setClubSelections}
                    /> 

                    <Divider orientation="vertical" flexItem style={{ margin: '0 10px' }} />

                    <Box flex={0.3} style={{ padding: '0 20px' }} className="sticky top-20">
                        <Typography variant="h6">
                            Your Selections
                        </Typography>
                        {clubSelections.map((selection, index) => (
                            <Box key={index} marginBottom={2} style={{
                                backgroundColor: (index + 1 === term) ? '#f5f5f5' : 'transparent',
                                padding: '5px',
                                borderRadius: '4px'
                            }}>
                                <Typography
                                    variant="subtitle1"
                                    style={{
                                        fontWeight: (index + 1 === term) ? 'bold' : 'normal'
                                    }}
                                >
                                    Term {index + 1}
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    style={{
                                        textDecoration: (index + 1 === term && day === 'Wednesday') ? 'underline' : 'none'
                                    }}
                                >
                                    Wednesday: {selection.Wednesday ? selection.Wednesday.id : 'Not Selected'}
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    style={{
                                        textDecoration: (index + 1 === term && day === 'Friday') ? 'underline' : 'none'
                                    }}
                                >
                                    Friday: {selection.Friday ? selection.Friday.id : 'Not Selected'}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>


                <Tooltip id="icon-tooltip-s" effect="solid" />
            </Box>
        </Modal>
    );


}
