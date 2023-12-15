// import React, { createContext, useContext, useState } from "react";

// const AvailableClubsContext = createContext();

// export function useAvailableClubs() {
//     return useContext(AvailableClubsContext);
// }

// export function AvailableClubsProvider({ children }) {
//     const [availableClubs, setAvailableClubs] = useState({});
//     const [alreadyBooked, setAlreadyBooked] = useState({});

//     return (
//         <AvailableClubsContext.Provider
//             value={{
//                 availableClubs,
//                 setAvailableClubs,
//                 alreadyBooked,
//                 setAlreadyBooked,
//             }}
//         >
//             {children}
//         </AvailableClubsContext.Provider>
//     );
// }

// export function findClubInstanceFromTermDay(data, term, day) {
//     // Convert term to string because keys in the object are strings
//     const termStr = String(term);

//     // Check if the term exists in the data
//     if (data.hasOwnProperty(termStr)) {
//         // Check if the day exists for that term
//         if (data[termStr].hasOwnProperty(day)) {
//             return data[termStr][day];
//         } else {
//             return null; // Day not found
//         }
//     } else {
//         return null; // Term not found
//     }
// }

// export function findClubByInstanceID(clubs, instanceID) {
//     return Object.values(clubs).find((club) => {
//         return Object.values(club.club_instances).some(
//             (instance) => instance.id === instanceID,
//         );
//     });
// }

// export function filterClubsByTermDay(clubs, term, day) {}
