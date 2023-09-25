import Modal from '@mui/material/Modal';

import { Alert, Box } from "@mui/material";
import { Button } from '@mui/material';

import toast from 'react-hot-toast';
import postClub from "../scripts/BookClub";


export default function ConfirmChoicesDialogue({changeInfoModalOpen, selectedChangeInfo, selectedInstanceToBook, setChangeInfoModalOpen, handleClose, setAvailableClubs, setClubSelections}) {

    return (
        <Modal
            open={changeInfoModalOpen}
            onClose={() => setChangeInfoModalOpen(false)}
            aria-labelledby="change-info-modal-title"
            aria-describedby="change-info-modal-description"
        >
            <Box
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 bg-white shadow-xl p-10 rounded-lg"
            >

                <h2
                    id="change-info-modal-title"
                    className="text-center text-4xl mb-5 font-bold "
                >
                    Are you sure?
                </h2>

                {
                    selectedChangeInfo.clubsToDelete ?
                        <Alert severity='warning' className='mb-4'>
                            Going ahead will delete one or more of your existing bookings
                        </Alert>
                    :
                        <>
                        
                        </>
                }

                <div className="flex justify-center gap-10">
                
                    <div className="">
                        <p className="text-green-500 mb-3">
                            Clubs to Book: {selectedChangeInfo.clubsToBook?.join(", ")}
                        </p>
                    </div>

                    <div>
                        <p className="text-red-500 mb-5">
                            Clubs to Remove: {selectedChangeInfo.clubsToDelete?.join(", ")}
                        </p>
                    </div>
                </div>

                <div className='flex justify-center items-center gap-5'>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {

                            const notify = toast.promise(
                                postClub(selectedInstanceToBook),
                                {
                                    loading: `Booking club... ${selectedInstanceToBook}`,
                                    success: 'Club booked successfully!',
                                    error: (err) => err.toString()
                                }
                            ).then((response) => {
                                console.log("response is: ", response);


                                console.log(response.data);

                                const newBookedClubs = response.data.alreadyBookedOn;

                                setAvailableClubs(response.data.availableClubs);
                                setClubSelections(Object.values(newBookedClubs));

                                handleClose(true);
                            }).catch((error) => {
                                // Handle any error from postClub if needed
                                console.error("Error booking club:", error);
                            });


                            setChangeInfoModalOpen(false);

                        }}
                    >
                        Confirm and Book
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setChangeInfoModalOpen(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </Box>
        </Modal>
    )
}