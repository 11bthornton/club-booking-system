import React from "react";
import { ClubChoiceCard } from "@/Components/ClubMarket/ClubChoiceCard";

export function TermChoiceCard({ term }) {
    return (
        <div className="flex flex-col gap-2 p-6 rounded-md  ">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 ">
                {["Wednesday", "Friday"].map((day) => (
                    <ClubChoiceCard term={term} day={day} />
                ))}
                {/* <Card color='transparent' className='shadow-none '>
                <CardBody>
                    <div className='flex flex-col items-center justify-center h-full'>
                        <LoadingCircle />
                    </div>

                </CardBody>
            </Card> */}
            </div>
        </div>
    );
}
