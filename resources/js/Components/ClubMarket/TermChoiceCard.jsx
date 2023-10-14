import React from "react";
import { ClubChoiceCard } from "@/Components/ClubMarket/ClubChoiceCard";

export function TermChoiceCard({ csrf, term }) {
    return (
        <div className="flex flex-col gap-2 p-6 rounded-md  ">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 ">
                {["Wednesday", "Friday"].map((day) => (
                    <ClubChoiceCard term={term} day={day} key={`${term}-${day}`} csrf={csrf}/>
                ))}
                
            </div>
        </div>
    );
}


