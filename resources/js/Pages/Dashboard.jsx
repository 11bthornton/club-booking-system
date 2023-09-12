import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, clubs }) {

    const sortDays = (a, b) => {
        const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return daysOrder.indexOf(a.day_of_week) - daysOrder.indexOf(b.day_of_week);
    };

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
                        const halfTermClubs = (clubs.filter(club => club.half_term === halfTerm) || []).sort(sortDays);

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
                                                <div key={clubForDay.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4">
                                                    <h3 className="text-lg font-semibold">{clubForDay.day_of_week}</h3>
                                                    <p>Club ID: {clubForDay.club_id}</p>
                                                    <p>Capacity: {clubForDay.capacity}</p>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div key={day} className="border-2 border-dashed border-gray-400 bg-transparent overflow-hidden shadow-sm sm:rounded-lg p-4">
                                                    <h3 className="text-lg font-semibold">{day}</h3>
                                                    <p className="text-lg">You haven't booked a club for this day in this half-term.</p>
                                                    <a href="">Hey</a>
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
