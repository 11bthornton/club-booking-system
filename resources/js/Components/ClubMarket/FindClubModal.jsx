import React from "react";
import { useAvailableClubs, findClubByInstanceID } from "@/ClubContext";
import {
    Typography,
    Dialog,
    DialogHeader,
    DialogBody,
} from "@material-tailwind/react";
import { OptionCard } from "@/Components/ClubMarket/OptionCard";

export function FindClubModal({ open, term, day, handleOpen, adminMode = {flag: false, id: -1} }) {
    const { availableClubs } = useAvailableClubs();

    const filteredClubs = Object.values(availableClubs)
        .flatMap((club) => Object.values(club.club_instances))
        .filter(
            (clubInstance) =>
                clubInstance.day_of_week == day &&
                clubInstance.half_term == term,
        );

    return (
        <Dialog
            open={open}
            handler={handleOpen}
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
            }}
            className="h-[80vh] overflow-y-scroll w-full"
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
            <DialogBody className="overflow-y-auto p-6 overflow-x-hidden">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10">
                    {filteredClubs.map((clubInstance) => {
                        const club = findClubByInstanceID(
                            availableClubs,
                            clubInstance.id,
                        );
                        return (
                            <>
                                <OptionCard
                                    currentClubInstance={clubInstance}
                                    currentClubInfo={club}
                                    term={term}
                                    day={day}
                                    handleOpenFind={handleOpen}
                                    adminMode={adminMode}
                                />
                            </>
                        );
                    })}
                </div>
            </DialogBody>
        </Dialog>
    );
}
