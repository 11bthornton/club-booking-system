import React from "react";

import { EmptyChoiceCard } from "@/Components/ClubMarket/EmptyChoiceCard";
import { FilledChoiceCard } from "@/Components/ClubMarket/FilledChoiceCard";

export function ClubChoiceCard({ csrf, term, day, userAvailableClubs, alreadyBooked, setAvailableClubs, setAlreadyBooked }) {

    const currentClubInstances = Object.values(alreadyBooked).flatMap(e => Object.values(e)).filter(f => f).filter(
        c => c.day_of_week == day && c.half_term == term
    );

    let currentClubInstance = null;
    let currentClubInfo = null

    if(currentClubInstances) {
        currentClubInstance = currentClubInstances[0]
        currentClubInfo = currentClubInstance ? currentClubInstance.club : null;
    }
        
    return (
        <>
            {
                currentClubInfo ? (
                    <FilledChoiceCard
                        term={term}
                        day={day}
                        currentClubInfo={currentClubInfo}
                        currentClubInstance={currentClubInstance}
                        csrf={csrf}
                        userAvailableClubs={userAvailableClubs}
                        alreadyBooked={alreadyBooked}
                        setAvailableClubs={setAvailableClubs}
                        setAlreadyBooked={setAlreadyBooked}
                    />
                ) : (
                    <EmptyChoiceCard
                        term={term} 
                        day={day} 
                        csrf={csrf}
                        userAvailableClubs={userAvailableClubs}
                        alreadyBooked={alreadyBooked}
                        setAvailableClubs={setAvailableClubs}
                        setAlreadyBooked={setAlreadyBooked}
                    />
                )
            }
        </>
    );
}
