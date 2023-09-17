import React, { useState } from "react";

import { groupBy } from "../ClubMarket";
import toast from "react-hot-toast";

const ClubCard = ({ club, currentBookingChoices, updateBookingChoice, availableClubs }) => {

    const groupedByTerm = groupBy(
        club.club_instances,
        instance => instance.half_term.toString()
    );

    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div key={club.id} className="p-4 border rounded shadow bg-gray-50 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold">{club.name}</h3>
                    <p className="text-gray-600 mb-2">{club.description}</p>
                    <p className="text-sm italic mb-2">{club.rule}</p>
                </div>

                <button onClick={() => setModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Book</button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="flex">
                    {Object.keys(groupedByTerm).map(term => (
                        <div key={term} className="mb-2 mr-4">
                            <strong>Term {term}:</strong>
                            <form>
                                {groupedByTerm[term].map(instance => (
                                    <div key={instance.id} className="text-gray-500">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name={`term-${term}`}
                                                value={instance.day_of_week}
                                                className="mr-2"
                                                checked={currentBookingChoices[term][instance.day_of_week]?.id === instance.id}
                                                onChange={(e) => updateBookingChoice(e, term, instance)}
                                            />
                                            {`Day: ${instance.day_of_week} - ${instance.id}`} - {
                                                currentBookingChoices[term][instance.day_of_week]?.id === instance.id ?
                                                    "Selected"
                                                    :
                                                    currentBookingChoices[term][instance.day_of_week] ?
                                                        <em className='text-red-500'>Selecting this will remove your booking for this day: {availableClubs[currentBookingChoices[term][instance.day_of_week].club_id].name}</em>
                                                        : "Available"
                                            }
                                        </label>
                                    </div>
                                ))}
                            </form>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}

export default ClubCard;




const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg w-3/4 overflow-auto max-h-3/4">
                <button onClick={onClose} className="mb-2">Close</button>
                {children}
            </div>
        </div>
    );
}