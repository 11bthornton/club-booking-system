import React from "react";
import { ClubChoiceCard } from "@/Components/ClubMarket/ClubChoiceCard";

export function TermChoiceCard({ csrf, term, days, userAvailableClubs, alreadyBookedOn, setAvailableClubs, setAlreadyBooked }) {

    

    return (
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full ">
               
                {
                    days.map((day) => (
                        <ClubChoiceCard
                            term={term} 
                            day={day} 
                            key={`${term}-${day}`} 
                            csrf={csrf}
                            userAvailableClubs={userAvailableClubs}
                            alreadyBooked={alreadyBookedOn}
                            setAlreadyBooked={setAlreadyBooked}
                            setAvailableClubs={setAvailableClubs}
                        />
                    ))
                }
                
            </div>
    );
}


