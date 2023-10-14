import React from "react";
import {
    useAvailableClubs,
    findClubInstanceFromTermDay,
    findClubByInstanceID,
} from "@/ClubContext";
import { EmptyChoiceCard } from "@/Components/ClubMarket/EmptyChoiceCard";
import { FilledChoiceCard } from "@/Components/ClubMarket/FilledChoiceCard";

export function ClubChoiceCard({ csrf, term, day }) {
    const { availableClubs, alreadyBooked } = useAvailableClubs();

    const currentClubInstance = findClubInstanceFromTermDay(
        alreadyBooked,
        term,
        day,
    );

    const currentClubInfo = currentClubInstance ? currentClubInstance.club : null;
    
    // currentClubInfo = typeof currentClubInfo == "undefined" ? currentClubInstance.club : currentClubInfo;
    
    return currentClubInfo ? (
        <FilledChoiceCard
            term={term}
            day={day}
            currentClubInfo={currentClubInfo}
            currentClubInstance={currentClubInstance}
            csrf={csrf}
        />
    ) : (
        <EmptyChoiceCard term={term} day={day} csrf={csrf} />
    );
}
