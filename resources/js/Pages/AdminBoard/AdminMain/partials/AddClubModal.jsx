import { React, useState } from "react";

import toast from "react-hot-toast";

export default function AddClubModal({
    isModalOpen,
    setIsModalOpen,
    setClubs,
}) {
    const [newClubInfo, setNewClubInfo] = useState({
        name: "",
        description: "",
        rule: "",
        year_groups: [],
    });

    console.log(newClubInfo.year_groups);

    async function handleAddClub() {
        try {
            const response = await fetch(`/admin/clubs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    name: newClubInfo.name,
                    description: newClubInfo.description,
                    rule: newClubInfo.rule,
                }),
            });

            const responseData = await response.json();
            console.log(responseData.message);

            if (responseData.success) {
                console.log("handling response, ", responseData);
                setClubs((prev) => [...prev, responseData]);
                toast("Club Successfully Added!", {
                    icon: "👏",
                });
                handleCloseModal();
            }
        } catch (error) {
            console.error(error);
            toast(
                `Error inserting new club '${newClubInfo.name}', are you admin?`,
                {
                    icon: "❌",
                },
            );
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewClubInfo({});
    };

    const handleYearCheck = (e) => {
        const year = e.target.value;

        // If the checkbox is checked and the year is not in the array, add it
        if (e.target.checked && !newClubInfo.year_groups.includes(year)) {
            setNewClubInfo((prevState) => ({
                ...prevState,
                year_groups: [...prevState.year_groups, year],
            }));
        }

        // If the checkbox is unchecked and the year is in the array, remove it
        else if (!e.target.checked && newClubInfo.year_groups.includes(year)) {
            setNewClubInfo((prevState) => ({
                ...prevState,
                year_groups: prevState.year_groups.filter((y) => y !== year),
            }));
        }
    };

    return (
        isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded shadow-lg">
                    <h2 className="text-xl mb-4">Add New Club</h2>

                    <input
                        type="text"
                        value={newClubInfo.name}
                        onChange={(e) =>
                            setNewClubInfo((prevState) => ({
                                ...prevState,
                                name: e.target.value,
                            }))
                        }
                        className="border rounded p-2 w-full mb-4"
                        placeholder="Club Name"
                    />

                    <textarea
                        value={newClubInfo.description}
                        onChange={(e) =>
                            setNewClubInfo((prevState) => ({
                                ...prevState,
                                description: e.target.value,
                            }))
                        }
                        className="border rounded p-2 w-full mb-4"
                        placeholder="Club Description"
                    />

                    <input
                        type="text"
                        value={newClubInfo.rule}
                        onChange={(e) =>
                            setNewClubInfo((prevState) => ({
                                ...prevState,
                                rule: e.target.value,
                            }))
                        }
                        className="border rounded p-2 w-full mb-4"
                        placeholder="Rule"
                    />

                    <p>Open to: </p>
                    <div className="flex mb-4">
                        {["7", "8", "9", "10", "11"].map((year) => (
                            <label
                                key={year}
                                className="mr-4 flex items-center"
                            >
                                <input
                                    type="checkbox"
                                    value={year}
                                    onChange={handleYearCheck}
                                />
                                <span className="ml-2">Year {year}</span>
                            </label>
                        ))}
                    </div>

                    <p>On </p>
                    <div className="flex mb-4">
                        {["Wednesdays", "Fridays"].map((day) => (
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

                    <button
                        onClick={handleAddClub}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Club
                    </button>
                    <button onClick={handleCloseModal} className="ml-4">
                        Cancel
                    </button>
                </div>
            </div>
        )
    );
}
