import React from "react";
import {
    Typography,
    Dialog,
    DialogHeader,
    DialogBody,
} from "@material-tailwind/react";
import { OptionCard } from "@/Components/ClubMarket/OptionCard";

export function FindClubModal({ csrf, open, term, day, handleOpen, adminMode = { flag: false, id: -1 }, userAvailableClubs, alreadyBooked, setAvailableClubs, setAlreadyBooked }) {



    const filteredClubs = Object.values(userAvailableClubs)
        .map(club => (
            {
                name : club.name,
                description : club.description,
                is_paid: club.is_paid,
                rule: club.rule,
                instances: Object.values(club.club_instances).filter(
                    x => x.half_term == term && x.day_of_week == day
                    // x => true
                ),
                payment_type: club.payment_type
            }
        )).filter(club => club.instances.length > 0)

    console.log("filtered ", filteredClubs)
        

    return (
        <Dialog
            open={open}
            handler={handleOpen}
            size="xl"
            style={
                {
                    width: "100%"
                }
            }
            className="bg-gray-100"
        >
            <DialogHeader>
                <div className="flex justify-between w-full items-baseline">
                    <Typography variant="h2">Find a Club</Typography>
                    <Typography
                        variant="h5"
                        className="tracking-widest uppercase"
                    >
                        Term {term} - {day}
                    </Typography>
                </div>
            </DialogHeader>
            <DialogBody className="  overflow-x-auto pb-6 overflow-y-auto h-[80vh]">
                <div class="flex flex-col" >
                    
                    {
                        filteredClubs.map(club => {
                            
                            if(club.instances.length) {
                                return (
                                    <>
                                        <OptionCard
                                        currentClubInstance={club.instances[0]}
                                        currentClubInfo={club}
                                        term={term}
                                        day={day}
                                        handleOpenFind={handleOpen}
                                        adminMode={adminMode}
                                        key={club.instances[0].id}
                                        csrf={csrf}
                                        userAvailableClubs={userAvailableClubs}
                                        alreadyBooked={alreadyBooked}
                                        setAvailableClubs={setAvailableClubs}
                                        setAlreadyBooked={setAlreadyBooked}
                                    /></>
                            );
                            }


                            return(
                                <></>
                            )
                            
                            
                    })}
                </div>
            </DialogBody>
        </Dialog>
    );
}
