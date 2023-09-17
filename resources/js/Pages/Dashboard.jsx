import { useState } from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import toast from 'react-hot-toast';

export default function Dashboard({ auth, bookedClubInstances, clubInformation }) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Your Clubs</h2>}
        >
            <Head title="Your Clubs" />
            <div className="max-w-7xl mx-auto flex sm:px-6 lg:px-8">
                {
                    JSON.stringify(bookedClubInstances)
                }
            </div>

        </AuthenticatedLayout>
    );
}
