import { useState } from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import toast from 'react-hot-toast';

export default function Dashboard({ auth, bookedClubInstances, clubInformation }) {

    const sortDays = (a, b) => {
        const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return daysOrder.indexOf(a.day_of_week) - daysOrder.indexOf(b.day_of_week);
    };

    function truncateDescription(description, length = 100) {
        return description.length > length
            ? description.substring(0, length) + "..."
            : description;
    }

    const [currentBookings, setCurrentBookings] = useState(bookedClubInstances);

    async function handleRemoveBooking(clubInstanceId) {
        try {
            const response = await fetch(`/dashboard/bookings/${clubInstanceId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            
            const updatedClubs = await response.json();

            if (updatedClubs.success) {
                

                setCurrentBookings(updatedClubs.data);


                toast.success("Successfully removed the booking!")
                // Here, you can also update your state or any other component data with the updatedClubs data
            } else {
                toast.error("Error, ")
            }
        } catch (error) {
                toast.error("Error, ")
            alert("An error occurred while removing the booking.");
        }
    }
    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Your Clubs</h2>}
        >
            <Head title="Your Clubs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Iterate over each of the six half-terms */}
                    {[1, 2, 3, 4, 5, 6].map(halfTerm => {
                        const halfTermClubs = (currentBookings.filter(clubInstance => clubInstance.half_term === halfTerm) || []).sort(sortDays);

                        return (
                            <div key={halfTerm} className="mb-6">
                                {/* Display half-term header */}
                                <h2 className="text-xl font-bold mb-4">Half-Term: {halfTerm}</h2>

                                {/* Display clubs for the half-term */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {['Wednesday', 'Friday'].map(day => {
                                        const clubForDay = halfTermClubs.find(club => club.day_of_week === day);
                                        if (clubForDay) {
                                            return (
                                                <div key={clubForDay.id} className="bg-gray-50 overflow-hidden shadow-lg sm:rounded-lg p-6 space-y-4">
                                                    <h3 className="text-xl font-bold text-blue-600">{clubForDay.day_of_week}</h3>
                                                    <h4 className="text-lg font-semibold text-gray-800">{clubForDay.club.name}</h4>
                                                    <p className="text-gray-600">{truncateDescription(clubForDay.club.description, 100)}
                                                        <a href={`/club-details/${clubForDay.club_id}`} className="text-blue-500 hover:underline">Read More</a>
                                                    </p>
                                                    <div className="border-t border-gray-200 pt-4 space-y-2">
                                                        {/* <p className="text-sm text-gray-500 flex items-center">
                                                            Club ID: <span className="ml-2 font-medium text-gray-700">{clubForDay.club_id}</span>
                                                        </p> */}
                                                        <p className="text-sm text-gray-500 flex items-center">
                                                            Capacity: <span className="ml-2 font-medium text-gray-700">{clubForDay.capacity}</span>
                                                        </p>
                                                    </div>
                                                    {/* Remove Booking Button */}
                                                    <button onClick={() => handleRemoveBooking(clubForDay.id)} className="text-white bg-red-500 hover:bg-red-600 focus:ring-red-500 focus:ring-offset-red-200 focus:outline-none text-sm py-2 px-4 rounded">
                                                        Remove Booking
                                                    </button>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div key={day} className="border-2 border-dashed border-gray-400 bg-transparent overflow-hidden shadow-sm sm:rounded-lg p-4">
                                                    <h3 className="text-lg font-semibold">{day}</h3>
                                                    <p className="text-lg">You haven't booked a club for this day in this half-term.</p>
                                                    <a href="#your-link" className="text-blue-500 hover:text-blue-700  hover:no-underline transition duration-150">
                                                        Book for this day
                                                    </a>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
