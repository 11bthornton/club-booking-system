import React, { useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head } from '@inertiajs/react';
import { Head } from '@inertiajs/react';


import { toast } from "react-hot-toast";

import AddClubModal from "./partials/AddClubModal";

export default function Dashboard({ auth, clubs }) {

    const [currentClubs, setClubs] = useState(clubs);

    const [editingId, setEditingId] = React.useState(null);
    const [editedClubData, setEditedClubData] = React.useState({});
    const [updatingId, setUpdatingId] = React.useState(null);
    const [successIds, setSuccessIds] = React.useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Club Editor</h2>}
        >
            <Head title="Admin" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-x-auto mt-6">

                        <button
                            onClick={handleOpenModal}
                            className="bg-indigo-900 uppercase hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded mb-4"
                        >
                            Add New Club
                        </button>

                        <AddClubModal
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                            setClubs={setClubs}
                        />

                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Description</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Rule</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentClubs.map(club => (
                                    <tr key={club.id} className={` ${updatingId === club.id ? 'bg-gray-300' : ''} ${successIds.includes(club.id) ? 'bg-green-100' : ''}`}>

                                        <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                            {editingId === club.id ? (
                                                <input
                                                    type="text"
                                                    value={editedClubData.name || club.name}
                                                    onChange={(e) => setEditedClubData(prev => ({ ...prev, name: e.target.value }))}
                                                    className="border rounded py-2 px-3 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out"
                                                />
                                            ) : club.name}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            {editingId === club.id ? (
                                                <textarea
                                                    value={editedClubData.description || club.description}
                                                    onChange={(e) => setEditedClubData(prev => ({ ...prev, description: e.target.value }))}
                                                    className="border rounded py-2 px-3 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out w-full h-full"
                                                ></textarea>
                                            ) : (
                                                <div className="truncate w-[150px]"> {/* Set the width according to your needs */}
                                                    {club.description}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            {editingId === club.id ? (
                                                <select
                                                    value={editedClubData.rule || club.rule}
                                                    onChange={(e) => setEditedClubData(prev => ({ ...prev, rule: e.target.value }))}
                                                    className="border rounded py-2 px-3 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out w-[300px]" // Added width here
                                                >
                                                    <option value="rule1">Rule 1</option>
                                                    <option value="rule2">Rule 2</option>
                                                    <option value="rule3">Rule 3</option>
                                                    {/* Add more options as needed */}
                                                </select>
                                            ) : club.rule}
                                        </td>


                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <div className="flex items-center space-x-3">
                                                <button className="text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600" onClick={() => { }}>View</button>

                                                {editingId === club.id ? (
                                                    <>
                                                        <button className="text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600" onClick={() => saveClub(club.id)}>Save</button>
                                                        <button className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600" onClick={() => setEditingId(null)}>Cancel</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600" onClick={() => {
                                                            setEditingId(club.id);
                                                            setEditedClubData({});
                                                        }}>Edit</button>
                                                        <button className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600" onClick={() => deleteClub(club.id)}>Delete</button>
                                                    </>
                                                )}
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>


        </AuthenticatedLayout>
    );
}


export async function saveClub(id) {
    try {

        setUpdatingId(id);
        // Find the original club data
        const originalClub = clubs.find(club => club.id === id);

        // Merge original data with the edited data
        const dataToSend = {
            ...originalClub,
            ...editedClubData
        };

        const response = await fetch(`/admin/clubs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify(dataToSend)
        });

        const responseData = await response.json();
        console.table(responseData)
        if (responseData.message == 'Club updated successfully!') {
            // console.log("here")

            toast("Successfully modified club");

            setEditingId(null);
            setSuccessIds((prev) => [...prev, id]);

            setTimeout(() => {
                setSuccessIds((prev) => prev.filter(successId => successId !== id));
            }, 2000); // Flash green for 2 seconds
        }

        setEditingId(null); // Exit editing mode
    } catch (error) {
        console.error("There was an error updating the club:", error);
    } finally {
        setUpdatingId(null);
    }
}
