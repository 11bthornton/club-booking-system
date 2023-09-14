import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import toast from 'react-hot-toast';

export default function ClubShow({ auth, club, uniqueUsers }) {

    async function handleEditInstances()  {

        try {
            const response = await fetch(`/admin/clubs/${club.id}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(
                    {   
                        "club_id": JSON.stringify(club.id),
                        "instances": currentInstances
                    }
                )
            });
            
            console.log(currentInstances)
            const responseData = await response.json();
            console.log(responseData.message);

            console.log("error", responseData.error);
    
            if (responseData.updatedInstances) {
                console.log("handling response, ", responseData.message)
                // setClubs((prev) => [...prev, responseData]);
                toast('Club Successfully Added!', {
                    icon: '👏',
                });
                // handleCloseModal();
            }
        } catch (error) {
            console.error(error);
            toast(responseData.message, {
                icon: '❌'
            });
        }
    };

    const [currentInstances, setCurrentInstances] = useState(club.club_instances);

    const [bulkYearGroups, setBulkYearGroups] = useState({
        7: false, 8: false, 9: false, 10: false, 11: false
    });

    const [bulkUpdateEnabled, setBulkUpdateEnabled] = useState(true);

    const handleBulkYearGroupChange = (year) => {
        setBulkYearGroups({
            ...bulkYearGroups,
            [year]: !bulkYearGroups[year]
        });
    };

    const applyBulkUpdate = () => {

    };

    const findInstance = (half_term, day) => {
        return currentInstances.find(inst => inst.half_term === half_term && inst.day_of_week === day);
    };

    const handleInstanceUpdate = (id, updatedItem) => {
        const newItems = currentInstances.map(item =>
            item.id === id ? updatedItem : item
        );
        setCurrentInstances(newItems);
    }

    const handleInstanceAdd = (newInstance) => {

        const newItems = [...currentInstances, newInstance];
        setCurrentInstances(newItems);
    }

    const handleInstanceRemove = (day, half_term) => {
        const newItems = currentInstances
            .filter(instance => instance.day !== day)
            .filter(instance => instance.half_term !== half_term);
        setCurrentInstances(newItems);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{club.name}</h2>}
        >
            <div className="p-8 bg-gray-100 min-h-screen">
                <div className="bg-white p-6 rounded-lg shadow-lg">

                    {/* Club Information */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">{club.name}</h2>
                            <p className="text-gray-600 mb-2">{club.description}</p>
                            <p className="text-sm italic mb-2">{club.rule}</p>
                        </div>

                        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleEditInstances}>
                            Save Changes
                        </button>
                    </div>


                    <hr className="my-4" />

                    {/* Bulk Year Group Update */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 flex justify-between">
                            <h4 className="text-lg font-medium">Bulk Update Year Groups</h4>
                            {bulkUpdateEnabled &&
                                <button onClick={applyBulkUpdate} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-2 rounded">
                                    Apply to All
                                </button>
                            }
                        </div>

                        {[7, 8, 9, 10, 11].map(year => (
                            <div key={year} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={bulkYearGroups[year]}
                                    onChange={() => handleBulkYearGroupChange(year)}
                                    disabled={!bulkUpdateEnabled}
                                    className='ml-10'
                                />
                                <label className="ml-2 mr-2">Year {year}</label>
                            </div>
                        ))}
                    </div>

                    {/* Club Instances */}
                    <h3 className="text-xl font-medium mb-4 mt-4">Club Instances</h3>

                    {[1, 2, 3, 4, 5, 6].map(half_term => (
                        <div key={half_term} className="grid grid-cols-2 gap-4">
                            {['Wednesday', 'Friday'].map(day => {
                                const instance = findInstance(half_term, day);
                                return (
                                    <InstanceCard
                                        instance={instance}
                                        day={day}
                                        half_term={half_term}
                                        handleInstanceUpdate={handleInstanceUpdate}
                                        handleInstanceAdd={handleInstanceAdd}
                                        handleInstanceRemove={handleInstanceRemove}
                                    // setBulkUpdateEnabled={setBulkUpdateEnabled}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4">
                {JSON.stringify(currentInstances)}
                {JSON.stringify(uniqueUsers)}

            </div>
        </AuthenticatedLayout>
    );
}

function InstanceCard({ instance, half_term, day, handleInstanceUpdate, handleInstanceAdd, handleInstanceRemove }) {

    const [currentInstance, setCurrentInstance] = useState(instance)

    const renderYearGroupCheckboxes = (instance) => (
        [7, 8, 9, 10, 11].map(year => (
            <div key={year}>
                <input
                    type="checkbox"
                    checked={instance && instance.year_groups.some(yg => yg.year === year.toString())}
                    onChange={(e) => handleYearGroupChange(e, year)}
                />
                <label className="ml-2 mr-3">Year {year}</label>
            </div>
        ))
    );

    const handleYearGroupChange = (e, year) => {
        const isChecked = e.target.checked;
        let updatedYearGroups;

        if (isChecked) {
            // If checkbox is checked, add the year group to the array
            const newYearGroup = {
                year: year.toString(),
                created_at: null,
                updated_at: null,
                pivot: {}
            };
            updatedYearGroups = [...currentInstance.year_groups, newYearGroup];
        } else {
            // If checkbox is unchecked, filter out the year group
            updatedYearGroups = currentInstance.year_groups.filter(yg => yg.year !== year.toString());
        }

        const updatedInstance = {
            ...currentInstance,
            year_groups: updatedYearGroups
        };

        setCurrentInstance(updatedInstance);
        console.log("here", updatedInstance.year_groups);

        handleInstanceUpdate(updatedInstance.id, updatedInstance);
    };


    const initialiseInstance = () => {

        const newInstance = {
            day_of_week: day,
            half_term: half_term,
            capacity: 100,
            year_groups: []
        };

        setCurrentInstance(newInstance);
        handleInstanceAdd(newInstance);
    }

    const handleCapacityChange = (e) => {
        const updatedInstance = {
            ...instance,
            capacity: e.target.value
        }

        setCurrentInstance(updatedInstance);
        handleInstanceUpdate(updatedInstance.id, updatedInstance);
    };

    const handleRemoveInstance = (e) => {
        handleInstanceRemove(currentInstance.day, currentInstance.half_term)
        const newInstance = {}
        setCurrentInstance(newInstance)
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };


    return (
        <div key={day} className="mb-4 p-4 border rounded shadow-sm bg-gray-50 relative">

            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center h-screen">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                        <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg sm:text-left">
                            <div className="sm:flex sm:items-start">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Users in Current Instance</h3>
                                <ul>
                                    {currentInstance.users.map(user => (
                                        <>
                                            <li key={user.id} className="mb-2">{user.username}</li>
                                            <li key={user.id} className="mb-2">{user.username}</li>
                                        </>
                                    ))}
                                </ul>
                                <button onClick={toggleModal} className="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            {currentInstance ? (
                <>
                    <div
                        className="absolute top-2 right-2 text-red-600 text-2xl cursor-pointer"
                        onClick={handleRemoveInstance}
                    >
                        &times;
                    </div>
                    <h4 className="text-lg font-medium">{instance.day_of_week} Half Term: {instance.half_term}</h4>
                    <button onClick={toggleModal} className="text-blue-500 underline mb-5">
                        View Students
                    </button>
                    <label className="text-gray-600 mb-2 flex items-center">
                        Capacity:
                        <input
                            type="number"
                            value={currentInstance.capacity}
                            onChange={handleCapacityChange}
                            className="ml-2 border rounded w-20 text-gray-800"
                        />
                        <em className='ml-5 text-gray-800'>{currentInstance.users_count} students are already booked on this course!</em>
                    </label>

                    <h5 className="text-md font-semibold mb-2">Year Groups</h5>
                    <div className="flex flex-wrap">
                        {renderYearGroupCheckboxes(instance)}
                    </div>
                </>
            ) : (
                <>
                    <h4 className="text-lg font-medium">{day} Half Term: {half_term}</h4>
                    <p className="text-gray-500">No instance for Half Term {half_term} on {day}. </p>
                    <button className="text-blue-500 underline" onClick={initialiseInstance}>Add</button>
                </>
            )}
        </div>
    );

}