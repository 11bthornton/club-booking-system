import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import {
    Alert, Button, Checkbox, Textarea, Typography, Input, Collapse, ListItem,
    ListItemPrefix, Chip, Tooltip
} from "@material-tailwind/react";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import NameDescriptionAndRules from "./partials/NameDescriptionAndRules";
import GlobalCapacityCheck from "./partials/GlobalCapacityCheck";
import ClubInTermCard from "./partials/ClubInTermCard";


export default function ClubCreate({ auth, availableDays, club }) {

    const populateData = () => {
        return ({
            name: club.name,
            description: club.description,
            rule: club.rule,
            ruleChoice: "Per Session",
            is_paid: club.is_paid,
            payment_type: club.payment_type,
            instances: Array.from({ length: availableDaysForBooking.length * 6 }, (_, index) => availableDaysForBooking[index % availableDaysForBooking.length]
            ).map((day_of_week, i) => {

                const half_term = Math.floor(i / availableDaysForBooking.length) + 1;

                const potentiallyExistingClub = club.club_instances.filter(instance => instance.day_of_week == day_of_week && instance.half_term == half_term
                )[0];

                if (potentiallyExistingClub) {
                    return {
                        half_term: half_term,
                        day_of_week: day_of_week,
                        year_groups: potentiallyExistingClub.year_groups.map(y => Number(y.year)),
                        capacity: potentiallyExistingClub.capacity, // null means unlimited
                    };
                } else {

                    return ({
                        half_term: half_term,
                        day_of_week: day_of_week,
                        year_groups: [],
                        capacity: null, // null means unlimited
                    });
                }


            }),
            must_do_all: club.must_do_all,
            max_per_term: club.max_per_term,
            max_per_year: club.max_per_year
        });
    };


    const [defaultCapacity, setDefaultCapacity] = useState(20);

    // Number of Terms. 
    const totalCards = 6;

    // Initialize the state with an array of false values, one for each card
    const [cardOpen, setCardOpen] = useState(Array(totalCards).fill(false));

    // Handler function to toggle the state of a card at a given index
    const toggleCard = (index) => {
        const updatedCardOpen = [...cardOpen]; // Create a copy of the state array
        updatedCardOpen[index] = !updatedCardOpen[index]; // Toggle the value at the specified index
        setCardOpen(updatedCardOpen); // Update the state
    };

    // Define a custom sorting function
    function daySort(a, b) {
        const daysInWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return daysInWeek.indexOf(a) - daysInWeek.indexOf(b);
    }

    // Create a unique list of all the possible days that students can book clubs for.
    const availableDaysForBooking = [...new Set(availableDays.flatMap(d => d.days_array))].sort(daySort);

    const {
        delete: destroy, data, setData, errors, post, put, reset, recentlySuccessful,
    } = club ? useForm(populateData()) : useForm({
        name: "",
        description: "",
        rule: "",
        ruleChoice: "",
        is_paid: 0,
        payment_type: "Per Session",
        instances: Array.from({ length: availableDaysForBooking.length * 6 }, (_, index) => availableDaysForBooking[index % availableDaysForBooking.length]
        ).map((day_of_week, i) => ({
            half_term: Math.floor(i / availableDaysForBooking.length) + 1,
            day_of_week: day_of_week,
            year_groups: [7, 8, 9, 10, 11].filter(year => availableDays.filter(aV => aV.year == year)[0].days_array.includes(day_of_week)),
            capacity: null, // null means unlimited
        })),
        must_do_all: false,
        max_per_term: null,
        max_per_year: null
    });

    useEffect(() => {
        if (club) {
            setData(populateData());
        }
    }, [club]);

    // Max can only be positive, so enforce this client-side
    // useEffect(() => {

    //     if (data.max_per_term && data.max_per_term < 1) {
    //         setData("max_per_term", 1);
    //     }

    // }, [data.max_per_term]);

    // // Max can only be positive, so enforce this client-side
    // useEffect(() => {

    //     if (data.max_per_year && data.max_per_year < 1) {
    //         setData("max_per_year", 1);
    //     }

    // }, [data.max_per_year]);

    // useEffect(() => {
    //     console.log(data.must_do_all);

    //     if (data.must_do_all) {
    //         setData(prevState => ({
    //             ...prevState,
    //             max_per_term: 0,
    //             max_per_year: 0
    //         }));
    //     }

    // }, [data.must_do_all]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Add New Club
            </h2>}
        >
            <Head title={club ? `Update club ${club.name}` : "Add New Club"} />

            <form>

                <div className="container mx-auto flex-col gap-4">

                    <div className="bg-white mt-4 p-6 rounded-lg shadow-sm">

                        <Typography
                            variant="h4"
                        >
                            {club ? `Update club ${club.name}` : "Add New Club"}
                        </Typography>

                        <p className="mt-1 text-sm text-gray-600">
                            {club ? `Update club ${club.name} - note that you will only be able to update details such as the booking limits and availability when users currently cannot book the club, and there are no bookings associated with the club already.` : "Provide details for new club"}
                        </p>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <Alert
                                variant="ghost"
                                color="green"
                                className="mb-2"
                            >
                                Club successfully saved!
                            </Alert>
                        </Transition>

                        {
                            JSON.stringify(errors) != "{}" &&
                                <Alert className="mt-4" color="red" variant="ghost">
                                    There were errors, review the form and resubmit.
                                    <p className="font-bold mt-4 pl-4">
                                        {errors.instances && errors.instances}
                                    </p>
                                </Alert>
                        }

                        {
                            club ? 
                                <Button className="mt-3" variant="text" color="red"
                                    onClick={() => destroy(route("admin.clubs.delete", { id: club.id }))}
                                >
                                    Delete
                                </Button>
                            : <></>
                        }
                    </div>

                    <NameDescriptionAndRules
                        data={data}
                        errors={errors}
                        setData={setData}
                    />

                    <GlobalCapacityCheck
                        errors={errors}
                        defaultCapacity={defaultCapacity}
                        setDefaultCapacity={setDefaultCapacity}
                        data={data}
                        setData={setData}
                    />
                    
                    <Alert className="mt-4" variant="ghost" color="blue">
                        <strong>
                            Use the following cards to alter when the club is run on a per term basis.
                        </strong>
                        <br />
                        Open the cards to have a more fine-grained control over each day in each term.
                        <br />
                        <br />
                        <strong>Warning!</strong>
                        <br />
                        Pressing "Add All" will enable all possible year groups for all relatively eligible days. It does not act as an undo button.
                    </Alert>

                    <div className="mt-4">
                        <div>
                            {cardOpen.map((isOpen, index) => {

                                const term = index + 1;

                                const numberOfTimesClubRunInTerm = data.instances
                                    .filter(instance => instance.half_term == term)
                                    .filter(instance => instance.year_groups.length).length;

                                return(
                                    <ClubInTermCard
                                        term={term}
                                        index={index}
                                        numberOfTimesClubRunInTerm={numberOfTimesClubRunInTerm}
                                        data={data}
                                        setData={setData}
                                        isOpen={isOpen}
                                        availableDaysForBooking={availableDaysForBooking}
                                        availableDays={availableDays}
                                        toggleCard={toggleCard}
                                    />
                                )
                            })}

                        </div>

                    </div>
                    <div className=" rounded-lg shadow-sm mt-2 p-1 ">
                        <Typography
                            variant="h4"
                        >
                            Submit?
                        </Typography>
                        <p className="mt-1 text-sm text-gray-600 mb-4">
                            Review choices carefully, and when ready, press submit.
                        </p>
                        <p className="mt-1 text-sm text-red-600 mb-4">
                            Remember, all clubs start out with an unlimited default capacity,
                            so make sure to change it if this is not the case,
                        </p>
                        <Button className=" mb-4" color="blue" onClick={() => {
                            club ? put(route("admin.clubs.update", { id: club.id }), {
                                onSuccess: () => reset(),
                                onError: (error) => {
                                }
                            }) : post(route("admin.clubs.create"), {
                                onSuccess: () => reset(),
                                onError: (error) => {
                                }
                            });
                        }}> {club ? "Update" : "Add Club"} </Button>
                    </div>
                </div>

            </form>

        </AuthenticatedLayout>
    );
}
