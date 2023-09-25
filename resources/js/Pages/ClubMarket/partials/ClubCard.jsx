import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Typography, Box,
    Card,
    CardContent,
    CardActions, Alert
} from '@mui/material';
import { Divider } from '@mui/material';

import toast from 'react-hot-toast';
import { faCalendarDays, faDollarSign, faTrashCan, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import { ChooseClubButton } from './ChooseClubButton';

import deleteClub from "../scripts/DeleteBooking";

export function ClubCard({ day, isSelected, club, onChoose, term, instance, setClubSelections, setAvailableClubs }) {

    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        if (isSelected) {
            setAnimationClass('selected');
        } else {
            setAnimationClass('deselected');
        }
        const timeoutId = setTimeout(() => setAnimationClass(''), 300);

        return () => clearTimeout(timeoutId);
    }, [isSelected]);


    function handleDelete(instance) {

        toast.promise(
            deleteClub(instance),
            {
                loading: 'Removing Booking...',
                success: 'Booking removed successfully!',
                error: (err) => err.toString()
            }
        ).then((response) => {
            console.log("response is: ", response);
    
    
            console.log(response.data);
    
            const newBookedClubs = response.data.alreadyBookedOn;
    
            setClubSelections(Object.values(newBookedClubs));
            setAvailableClubs(response.data.availableClubs);
    
            handleClose(true);
        }).catch((error) => {
    
            console.error("Error booking club:", error);
        });
    }

    return (
        <Card
            variant="outlined"
            className={`card-animation ${animationClass} ${isSelected ? 'shadow-lg' : ''} `} // Use the CSS classes here

            style={{
                backgroundColor: 'transparent',
                width: '100%',
                margin: '1%',
                borderWidth: '2px',
                borderStyle: isSelected ? '' : 'dashed',
                borderColor: isSelected ? useTheme().palette.primary.main : useTheme().palette.warning.main,
                display: 'flex'
            }}
        >
            {isSelected && (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingY={2}
                    paddingX={2}
                    pr={2}
                >
                    {
                        /**
                         * This is merely a placeholder so that the main card content is aligned in the center
                         * along with the right-hand-side delete icon
                         */
                    }
                </Box>
            )}
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                flexGrow={1}
            >
                <CardContent>
                    <Typography fontWeight={300} variant="h6" align='center' className='tracking-wide' style={{ letterSpacing: "2px" }}>
                        <div className="flex items-baseline gap-2 justify-center">
                            <div>{ day.toUpperCase() }</div>
                            <div className="text-sm">TERM {term}</div>
                        </div>
                    </Typography>
                    <Typography variant="h6" className='mt-10' height={70} marginTop={2}>
                        {
                            club ?
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-center gap-2 items-baseline">
                                        <h6 align='center' className="font-semibold text-xl">{club.name}</h6>
                                    </div>
                                    <div className="flex items-center gap-2 justify-center">
                                        <FontAwesomeIcon icon={faCalendarDays} className="text-blue-500"/>
                                        <Divider orientation="vertical" flexItem style={{ margin: '0 10px' }} />
                                        <FontAwesomeIcon icon={faDollarSign}
                                color='red'
                                fontWeight={700} />
                                    </div>
                                </div>
                            : 
                                <Alert severity='warning'>
                                    You haven't selected a club for this day yet. You will be allocated "Home" if left unchecked 
                                </Alert>
                        }
                    </Typography>
                </CardContent>
                <CardActions style={{ justifyContent: 'center' }}>
                    <ChooseClubButton day={day} isSelected={isSelected} onChoose={onChoose} />
                </CardActions>
            </Box>
            {isSelected && (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingY={2}
                    paddingX={2}
                    pr={2}
                    color="grey"
                >
                    <button 
                        onClick={() => handleDelete(instance, setClubSelections, setAvailableClubs)}
                        data-tooltip-content="Delete"
                        data-tooltip-id="icon-tooltip"
                    >
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>

                    <Tooltip id="icon-tooltip" effect="solid" />
                    <Tooltip id="my-tooltip" />
                </Box>
            )}
        </Card>
    );
}

