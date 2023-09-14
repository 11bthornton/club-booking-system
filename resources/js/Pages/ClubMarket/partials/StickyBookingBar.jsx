import { useState, useEffect, useRef } from 'react';

import "./AnimateOnChange.css";
import toast from 'react-hot-toast';

export default function StickyBookingBar({ availableClubs, currentBookingChoices }) {

    async function bookClubs() {
        try {
            const response = await fetch(`/clubs/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    "club_instances": Object.values(currentBookingChoices).flatMap(day => Object.values(day).filter(item => item && item.id).map(item => item.id))
                })
            });
    
            // Check if response is not successful
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'An error occurred.');
            }
    
            const responseData = await response.json();
    
            if (responseData.success) {
                console.log("handling response, ", responseData.message);
                return responseData;
            } else {
                throw new Error(responseData.error || 'An error occurred.');
            }
    
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    

    return (
        <div className="sticky top-1">
            <h3 className="font-black mb-3" style={{ textTransform: "capitalize" }}>Your Selected Clubs:</h3>
            <p className='mb-4'>This is only a <em>preview</em>. Changes are not committed until you <strong>submit</strong> them</p>
            {Object.entries(currentBookingChoices).map(([term, days]) => (
                <div key={term} className="mb-6">
                    <strong>Term {term}:</strong>
                    <div className="flex flex-col mt-2 w-full">
                        <DayBookingInfo
                            availableClubs={availableClubs}
                            day={days.Wednesday}
                            dayName={"Wednesday"}
                        />
                        <DayBookingInfo
                            availableClubs={availableClubs}
                            day={days.Friday}
                            dayName={"Friday"}
                        />
                    </div>
                </div>
            ))}

            <button
                onClick={() => {
                    const promise = bookClubs();
                    toast.promise(
                        promise,
                        {
                            loading: 'Trying to book your clubs...',
                            success: "Bookings successfully updated",
                            error: (err) => `Error: ${JSON.parse(err.message).message}`,
                        }
                    );
                }}
                className="text-white bg-green-500 hover:bg-green-600 focus:ring-red-500 focus:ring-offset-red-200 focus:outline-none text-sm py-2 px-4 rounded">
                Update Choices
            </button>
        </div>
    );
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
function DayBookingInfo({ availableClubs, day, dayName }) {

    const handleRemoveDayBooking = (term, day) => {
        console.log(`Remove booking for term ${term} on ${day}`);
    }

    const [activeDay, animateDay] = useAnimateOnChange(
        day,
        500
    );

    return (
        <div className={`day ${animateDay ? "animate-out" : "animate-in"
            }`}>
            {day
                ? <span className="px-2 py-1 rounded mb-2 relative">
                    {availableClubs[day.club_id].name}
                    <button onClick={() => handleRemoveDayBooking(term, dayName)} className="text-red-500 absolute top-0 right-0 mt-1 mr-2">&times;</button>
                </span>
                : <span className="px-2 py-1 rounded mb-2 text-red-500">
                    No booking for {dayName}
                </span>
            }
        </div>
    )
}


/**
 * 
 * @param {*} value 
 * @param {*} duration 
 * @returns 
 */
export function useAnimateOnChange(value, defaultDuration = 300) {
    const [activeValue, setActiveValue] = useState(value);
    const [animation, setAnimation] = useState(null); // 'in', 'out', or null

    useEffect(() => {
        if (value !== activeValue) {
            setAnimation("out");

            const timeoutId = setTimeout(() => {
                setActiveValue(value);
                setAnimation("in");

                // Reset animation after 'in' duration
                const resetTimeoutId = setTimeout(() => {
                    setAnimation(null);
                }, defaultDuration);

                return () => clearTimeout(resetTimeoutId);
            }, defaultDuration);

            return () => clearTimeout(timeoutId);
        }
    }, [value, defaultDuration]);

    return [activeValue, animation];
}
