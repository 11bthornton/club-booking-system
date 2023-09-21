import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Typography, Box,
    Card,
    CardContent,
    CardActions, Alert
} from '@mui/material';
import toast from 'react-hot-toast';
import { faCalendarDays, faDollarSign, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import { ChooseClubButton } from './ChooseClubButton';

export function ClubCard({ day, isSelected, club, onChoose, removeClub, term, instance, setClubSelections, setAvailableClubs }) {

    async function deleteClub(clubId) {


        // Retrieve CSRF token from meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        console.log("deleting", clubId);

        try {
            const response = await fetch(`/club/${clubId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
            });

            const data = await response.json();

            // Check the response status
            if (response.ok) {
                // console.log(data); // Successfully booked the club.
                return data;
            } else {
                console.error(data.message); // Error messages, e.g., "No available slots for this club."
                throw new Error(data.message);
            }

        } catch (error) {
            console.error('There was an error:', error);
            throw error;
        }
    }

    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        if (isSelected) {
            setAnimationClass('selected');
        } else {
            setAnimationClass('deselected');
        }

        // Remove the animation class after the animation completes
        const timeoutId = setTimeout(() => setAnimationClass(''), 300);

        return () => clearTimeout(timeoutId);
    }, [isSelected]);


    return (
        <Card
            variant="outlined"
            className={`card-animation ${animationClass} ${isSelected ? 'shadow-lg' : ''} `} // Use the CSS classes here

            style={{
                backgroundColor: 'transparent',
                width: '45%',
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
                    {/* Here are some placeholder icons, replace them with your desired icons */}
                    {/* <CheckIcon color="primary" />
                <StarIcon color="primary" />
                <FavoriteIcon color="primary" /> */}
                </Box>
            )}
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                flexGrow={1}
            >
                <CardContent>
                    <Typography fontWeight={700} variant="h6" align='center' className='tracking-wide' style={{ letterSpacing: "2px" }}>{day.toUpperCase()}</Typography>
                    <Typography fontWeight={300} variant="h6" className='mt-10' height={70} marginTop={3}>
                        {club ?
                            <h6 align='center'>{club.name}</h6>
                            : <Alert severity='warning'> You haven't selected a club for this day yet. You will be allocated "Home" if left unchecked </Alert>}
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
                    <button onClick={() => {

                        toast.promise(
                            deleteClub(instance),
                            {
                                icon: faTrashCan,
                                loading: 'Deleting Club',
                                success: 'Club deleted successfully!',
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
                            // Handle any error from postClub if needed
                            console.error("Error booking club:", error);
                        });
                    }}
                        data-tooltip-content="Delete"
                        data-tooltip-id="icon-tooltip"
                    >
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                    <button onClick={() => console.log("Swap button clicked")} data-tooltip-content="Swap" data-tooltip-id="icon-tooltip">
                        <FontAwesomeIcon icon={faCalendarDays} />
                    </button>
                    {club.is_paid ?
                        <button onClick={() => console.log("Icon button clicked")}
                            data-tooltip-content="This is a paid club, parental consent will be required after booking."
                            data-tooltip-id="icon-tooltip"

                        >
                            <FontAwesomeIcon icon={faDollarSign}
                                color='red'
                                fontWeight={700} />
                        </button>
                        :
                        <button>
                            {
                                /**
                                 * Placeholder - need something to take the space.
                                 */
                            }
                        </button>}
                    <Tooltip id="icon-tooltip" effect="solid" />
                    <Tooltip id="my-tooltip" />
                </Box>
            )}
        </Card>
    );
}
