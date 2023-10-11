import React from "react";
import {
    useAvailableClubs,
    findClubInstanceFromTermDay,
    findClubByInstanceID,
} from "@/ClubContext";
import { EmptyChoiceCard } from "@/Components/ClubMarket/EmptyChoiceCard";
import { FilledChoiceCard } from "@/Components/ClubMarket/FilledChoiceCard";

export function ClubChoiceCard({ term, day }) {
    const { availableClubs, alreadyBooked } = useAvailableClubs();

    const currentClubInstance = findClubInstanceFromTermDay(
        alreadyBooked,
        term,
        day,
    );
    const currentClubInfo = findClubByInstanceID(
        availableClubs,
        currentClubInstance?.id,
    );

    return currentClubInfo ? (
        <FilledChoiceCard
            term={term}
            day={day}
            currentClubInfo={currentClubInfo}
            currentClubInstance={currentClubInstance}
        />
    ) : (
        <EmptyChoiceCard term={term} day={day} />
    );
}
