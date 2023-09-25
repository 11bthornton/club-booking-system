import React, { useEffect, useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import toast from "react-hot-toast";

export default function ClubCreate({ auth, clubs }) {

    const [selectedRule, setSelectedRule] = useState("wholeYear");

    const [formData, setFormData] = useState({
        clubTitle: '',
        clubDescription: '',
        clubRules: '',
        instances: Array(12).fill().map((_, i) => ({
            term_no: Math.floor(i / 2) + 1,
            day: i % 2 === 0 ? 'Wednesday' : 'Friday',
            yearGroups: [7, 8, 9, 10, 11],
            capacity: null // null means unlimited
        })),
        compatibilities: {}
    });

    function cartesianProduct(arr1, arr2) {
        const product = [];

        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i] < arr2[j]) {  // Ensure i is always smaller than j
                    product.push([arr1[i], arr2[j]]);
                }
            }
        }

        return product;
    }

    useEffect(() => {
        const allTempIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        let newIncompatible = {};
        let newMustGoWith = [];

        switch (selectedRule) {
            case "wholeYear":
                const allIncompatiblePairs = cartesianProduct(allTempIds, allTempIds);
                allIncompatiblePairs.forEach(([id1, id2]) => {
                    if (!newIncompatible[id1]) {
                        newIncompatible[id1] = [];
                    }
                    newIncompatible[id1].push(id2);
                });
                break;

            case "perTerm":
                for (let i = 1; i <= allTempIds.length; i += 2) {
                    const id1 = i;
                    const id2 = i + 1;

                    if (!newIncompatible[id1]) {
                        newIncompatible[id1] = [];
                    }
                    newIncompatible[id1].push(id2);
                }
                break;
            case "any":
                // No special handling for this rule.
                break;
        }

        setFormData(prevState => ({
            ...prevState,
            compatibilities: {
                "in": newIncompatible,
                "must": newMustGoWith
            }
        }));

    }, [selectedRule]);


    async function submitClubData() {

        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        try {
            const response = await fetch('/admin/clubs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.message) {
                console.log(data.message);
            } else {
                throw new Error(data.error);
            }

        } catch (error) {
            throw new Error(error);
        }
    }



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add New Club</h2>}
        >
            <Head title="Add New Club" />

            <div className="flex justify-center mt-5">

                <div className="bg-white p-8 rounded-lg shadow-md  w-5/6">

                    <form action="" onSubmit={(e) => {
                        e.preventDefault();

                        toast.promise(submitClubData(), {
                            loading: 'Submitting your request..',
                            success: 'Successfully added your club!',
                            error: (err) => `${err.toString()} `,
                        })

                    }}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="club-title">
                            Club Title
                        </label>
                        <input
                            value={formData.clubTitle}
                            className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="club-title"
                            type="text"
                            placeholder="Enter club title"
                            onChange={(e) => setFormData(prevState => ({ ...prevState, clubTitle: e.target.value }))}
    
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="club-description">
                            Club Description
                        </label>
                        <textarea
                            value={formData.clubDescription}
                            className="shadow appearance-none border rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="club-description"
                            placeholder="Enter club description"
                            onChange={(e) => setFormData(prevState => ({ ...prevState, clubDescription: e.target.value }))}
                            rows="3"
                            required
                        ></textarea>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="club-rules">
                            Club Rules
                        </label>
                        <textarea
                            value={formData.clubRules}
                            className="shadow appearance-none border rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="club-rules"
                            placeholder="Enter club rules description"
                            onChange={(e) => setFormData(prevState => ({ ...prevState, clubRules: e.target.value }))}
                            rows="3"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <select value={selectedRule} onChange={(e) => setSelectedRule(e.target.value)}>
                            <option value="wholeYear">One instance per year</option>
                            <option value="perTerm">One instance per term</option>
                            <option value="any">As many instances as they'd like</option>
                        </select>
                    </div>

                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-5 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Add Club
                    </button>

                    <div className="grid grid-cols-2 gap-8 p-8">
                    {Array.from({ length: 6 }, (_, i) => {
    const wednesdayInstance = formData.instances[2 * i];
    const fridayInstance = formData.instances[2 * i + 1];

    // Check if both Wednesday and Friday instances have no checked year groups
    const noCheckedYearGroups = wednesdayInstance.yearGroups.length === 0 && fridayInstance.yearGroups.length === 0;

    return (
        <div
            key={i}
            className={`bg-white p-6 rounded-lg shadow ${noCheckedYearGroups ? 'border-2 border-red-500' : ''}`}
        >
            
            <div className="flex justify-between font-bold w-full items-baseline">
                <h3 className="text-xl font-semibold">Term {i + 1}</h3>
                {
                    noCheckedYearGroups ? <em className="text-red-500 mb-4">This club will not run this term</em>
                    : <></>
                }
            </div>

            {['Wednesday', 'Friday'].map((day, k) => {
                const index = 2 * i + k;  // This maps term and day to the correct instance
                const instance = formData.instances[index];

                return (
                    <div key={day} className="mb-4">
                        <h4 className="text-lg font-medium mb-2">{day}</h4>

                        <div className="flex items-center space-x-4 mb-2">
                            {Array.from({ length: 5 }, (_, j) => (
                                <div key={j} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={instance.yearGroups.includes(j + 7)}
                                        onChange={(e) => {
                                            let updatedInstances = [...formData.instances];
                                            if (e.target.checked) {
                                                updatedInstances[index].yearGroups.push(j + 7);
                                            } else {
                                                updatedInstances[index].yearGroups = updatedInstances[index].yearGroups.filter(year => year !== j + 7);
                                            }
                                            setFormData(prevState => ({ ...prevState, instances: updatedInstances }));
                                        }}
                                        id={`instance-${index}`}
                                        defaultChecked
                                        className="mr-2"
                                    />
                                    <label htmlFor={`instance-${index}`}>Year {j + 7}</label>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center mt-2">
                            <label className="mr-2" htmlFor={`instance-${index}-capacity`}>Capacity:</label>
                            <input
                                type="text"
                                value={instance.capacity === null ? 'Unlimited' : instance.capacity.toString()}
                                onBlur={(e) => {

                                    if (isNaN(e.target.value)) {
                                        e.target.value = "Unlimited";
                                    }

                                    if (!e.target.value) {
                                        let updatedInstances = [...formData.instances];
                                        updatedInstances[index].capacity = null;
                                        setFormData(prevState => ({ ...prevState, instances: updatedInstances }));
                                    }
                                }}
                                onChange={(e) => {

                                    if (isNaN(e.target.value)) {
                                        e.target.value = "Unlimited";
                                    }

                                    let updatedInstances = [...formData.instances];
                                    updatedInstances[index].capacity = e.target.value === 'Unlimited' ? null : parseInt(e.target.value, 10);
                                    setFormData(prevState => ({ ...prevState, instances: updatedInstances }));
                                }}
                                defaultValue="Unlimited"
                                className="border rounded px-2 py-1"
                                id={`instance-${index}-capacity`}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    );
})}

                        <div className="flex items-center justify-between">
                        </div>
                    </div>
                    </form>



                </div>

            </div>
        </AuthenticatedLayout>
    );

}




