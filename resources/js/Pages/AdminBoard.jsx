import React, { useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head } from '@inertiajs/react';
import { Head, Link, useForm } from '@inertiajs/react';

import { Inertia } from '@inertiajs/inertia';
import { ToastContainer } from 'react-toastify';
import { Toaster, toast } from "react-hot-toast";
export default function Dashboard({ auth, clubs }) {

    const [currentClubs, setClubs] = useState(clubs);

    const [editingId, setEditingId] = React.useState(null);
    const [editedClubData, setEditedClubData] = React.useState({});
    const [updatingId, setUpdatingId] = React.useState(null);
    const [successIds, setSuccessIds] = React.useState([]);

    const saveClub = async (id) => {
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


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newClubName, setNewClubName] = useState('');
    const [newClubDescription, setNewClubDescription] = useState('');

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewClubName('');
        setNewClubDescription('');
    };

    const handleAddClub = async () => {
        try {
            const response = await fetch(`/admin/clubs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    name: newClubName,
                    description: newClubDescription,
                    rule: "hey",
                    // name: "omg did it work?"
                })
            });

            const responseData = await response.json();
            console.log(responseData.message);

            if (responseData) {
                console.log("handling response, ", responseData)
                setClubs((prev) => [...prev, responseData]);
                toast('Club Successfully Added!', {
                    icon: '👏',
                });
                handleCloseModal();
            }
        } catch (error) {
            toast(`Error inserting new club '${newClubName}', are you admin?`, {
                icon: '❌'
            });
        }
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
                        <button onClick={handleOpenModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
                            Add New Club
                        </button>

                        {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="bg-white p-8 rounded shadow-lg">
                                    <h2 className="text-xl mb-4">Add New Club</h2>
                                    <input
                                        type="text"
                                        value={newClubName}
                                        onChange={(e) => setNewClubName(e.target.value)}
                                        className="border rounded p-2 w-full mb-4"
                                        placeholder="Club Name"
                                    />
                                    <textarea
                                        value={newClubDescription}
                                        onChange={(e) => setNewClubDescription(e.target.value)}
                                        className="border rounded p-2 w-full mb-4"
                                        placeholder="Club Description"
                                    />
                                    <p>Open to: </p>
                                    <div className="flex mb-4">
                                        {['7', '8', '9', '10', '11'].map(year => (
                                            <label key={year} className="mr-4 flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={year}
                                                // You might want to set a state or have an onChange handler here
                                                // onChange={(e) => handleYearCheck(e)}
                                                />
                                                <span className="ml-2">Year {year}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <p>On </p>
                                    <div className="flex mb-4">
                                        {['Wednesdays', 'Fridays'].map(day => (
                                            <label key={day} className="mr-4 flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={day}
                                                // You might want to set a state or have an onChange handler here
                                                // onChange={(e) => handleYearCheck(e)}
                                                />
                                                <span className="ml-2"> {day}</span>
                                            </label>
                                        ))}
                                    </div>


                                    <button onClick={handleAddClub} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                        Add Club
                                    </button>
                                    <button onClick={handleCloseModal} className="ml-4">Cancel</button>
                                </div>
                            </div>
                        )}

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
                                        <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                            {editingId === club.id ? (
                                                <textarea
                                                    value={editedClubData.description || club.description}
                                                    onChange={(e) => setEditedClubData(prev => ({ ...prev, description: e.target.value }))}
                                                    className="border rounded py-2 px-3 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out w-full h-full"
                                                ></textarea>
                                            ) : club.description}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                            {editingId === club.id ? (
                                                <textarea
                                                    value={editedClubData.rule || club.rule}
                                                    onChange={(e) => setEditedClubData(prev => ({ ...prev, description: e.target.value }))}
                                                    className="border rounded py-2 px-3 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out "
                                                ></textarea>
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


