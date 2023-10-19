import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head } from "@inertiajs/react";

import { useForm } from "@inertiajs/react";
import {
    Alert, Button, Checkbox, Option, Select, Textarea, Typography, Input, Collapse, Card, CardBody, ListItem,
    ListItemPrefix, Switch, Chip, Tooltip
} from "@material-tailwind/react";

import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";

import { ChipWithStatus } from "@/Components/ClubMarket/ChipWithStatus";
import { Transition } from "@headlessui/react";

export default function ClubCreate({ auth, clubs, availableDays }) {

    const [defaultCapacity, setDefaultCapacity] = useState(20);
    const totalCards = 6; // Change this to the number of cards you have

    // Initialize the state with an array of false values, one for each card
    const [cardOpen, setCardOpen] = useState(Array(totalCards).fill(false));

    // Handler function to toggle the state of a card at a given index
    const toggleCard = (index) => {
        const updatedCardOpen = [...cardOpen]; // Create a copy of the state array
        updatedCardOpen[index] = !updatedCardOpen[index]; // Toggle the value at the specified index
        setCardOpen(updatedCardOpen); // Update the state
    };

    const daysOfWeek = [
        "Wednesday",
        "Friday",
        "Monday",
        "Thursday",
        "Tuesday",
        "Saturday",
        "Sunday"
    ];

    // Define a custom sorting function
    function daySort(a, b) {
        const daysInWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return daysInWeek.indexOf(a) - daysInWeek.indexOf(b);
    }

    const availableDaysForBooking = [...new Set(availableDays.flatMap(d => d.days_array))].sort(daySort);

    const {
        data,
        setData,
        errors,
        post,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        name: "",
        description: "",
        rules: "",
        ruleChoice: "",
        is_paid: false,
        instances: Array.from({ length: availableDaysForBooking.length * 6 }, (_, index) =>
            availableDaysForBooking[index % availableDaysForBooking.length]
        ).map((day_of_week, i) => ({
            half_term: Math.floor(i / availableDaysForBooking.length) + 1,
            day_of_week: day_of_week,
            year_groups: [7, 8, 9, 10, 11].filter(year => availableDays.filter(aV => aV.year == year)[0].days_array.includes(day_of_week)),
            capacity: null, // null means unlimited
        })),
        compatibilities: {
            "in": [],
            "must": []
        },
    })
    function uniqueListOfLists(listOfLists) {
        const stringifiedList = listOfLists.map(JSON.stringify);
        const uniqueStrings = new Set(stringifiedList);
        const uniqueLists = Array.from(uniqueStrings, JSON.parse);
        return uniqueLists;
    }

    function cartesianProduct() {
        const numbers = [...Array(6 * availableDaysForBooking.length).keys()].map(i => i + 1); // Generate numbers from 1 to 12
        const result = [];

        for (let i = 0; i < numbers.length; i++) {
            for (let j = i + 1; j < numbers.length; j++) {
                result.push([numbers[i], numbers[j]]);
            }
        }

        return result;
    }

    function helperCartesianProduct(start, end) {
        const numbers = Array.from(Array(end - start + 1).keys(), (num) => num + start);
        const result = [];

        for (let i = 0; i < numbers.length; i++) {
            for (let j = i + 1; j < numbers.length; j++) {
                result.push([numbers[i], numbers[j]]);
            }
        }

        return result;
    }

    useEffect(() => {

        switch (data.ruleChoice) {
            case 'NoRestrictions':
                setData(
                    "compatibilities",
                    {
                        "in": [],
                        "must": []
                    }
                )
                break;

            case 'OncePerYear':
                setData(
                    "compatibilities",
                    {
                        "in": cartesianProduct(),
                        "must": []
                    }
                )
                break;

            case 'OncePerTerm':
                setData(
                    "compatibilities",
                    {
                        "in": uniqueListOfLists(Array.from(Array(availableDaysForBooking.length).keys(), num => num + 1)
                            .flatMap(x => helperCartesianProduct(x, 6 * x))),
                        "must": []
                    }
                )
                break;

            case 'MustDoAll':
                setData(
                    "compatibilities",
                    {
                        "in": [],
                        "must": cartesianProduct(),
                    }
                )
                break;

            default:
                // Code to execute if none of the options match
                break;
        }


    }, [data.ruleChoice]);



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Add New Club
                </h2>
            }
        >
            <Head title="Add New Club" />
            
            <form>
                <div className="container mx-auto flex-col gap-4">

                    <div className="bg-white mt-4 p-6 rounded-lg shadow-sm">

                        <Typography
                            variant="h4"
                        >
                            Add a New Club
                        </Typography>

                        <p className="mt-1 text-sm text-gray-600">
                            Provide details for a new club.
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
                            </Alert>
                        }
                    </div>

                    <div className="bg-white mt-4 p-6 rounded-lg shadow-sm">

                        <div>

                            <p className="mt-1 mb-3 text-sm text-gray-600">
                                <em><strong>Required</strong></em>: Provide a name for this club.
                            </p>
                            <TextInput
                                id="name"
                                className="w-2/5 mb-4"
                                placeholder="Club Name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                aria-required
                            />
                            {
                                errors.name &&
                                <Alert className="mb-4" color="red" variant="ghost">
                                    {errors.name}
                                </Alert>
                            }
                        </div>
                        <p className="mt-1 mb-3 text-sm text-gray-600">
                            <em><strong>Required</strong></em>: Provide a textual description for this club.
                        </p>
                        <div>
                            <Textarea
                                id="description"
                                label="Club Description"
                                className="w-2/5 mb-4"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                aria-required
                            />
                            {
                                errors.description &&
                                <Alert className="mb-4" color="red" variant="ghost">
                                    {errors.description}
                                </Alert>
                            }
                            <p className="mt-1 mb-3 text-sm text-gray-600">
                                <em><strong>Optional</strong></em>: Describe any special rules about this club.
                            </p>
                        </div>
                        <div>
                            <Textarea
                                id="rules"
                                label="Rule Description"
                                className="w-2/5 mb-4"
                                value={data.rules}
                                onChange={(e) =>
                                    setData("rules", e.target.value)
                                }
                            />
                        </div>
                        {
                            errors.rules &&
                            <Alert className="mb-4" color="red" variant="ghost">
                                {errors.rules}
                            </Alert>
                        }
                        <p className="mt-1 mb-3 text-sm text-gray-600">
                            <em><strong>Required</strong></em>: Select a ruleset. <br />
                            Take care with selecting "Must do all". Students must be able to book all clubs you have created in this case.
                            This is most important for when year groups do their clubs on different days. Students in Year 7, might, for example,
                            only be able to book clubs on Wednesdays and Fridays, in comparison to Thursdays and Fridays for other year groups.
                        </p>
                        <div className="mt-4">
                            <Select
                                value={data.ruleChoice}
                                label="Select Ruleset"
                                // onChange={(e) => 
                                //     setData("ruleChoice", e.target.value)
                                // }
                                onChange={(e) =>
                                    setData("ruleChoice", e)
                                }
                                aria-required
                            >
                                <Option value="NoRestrictions" >No restrictions</Option>
                                <Option value="OncePerYear">Only once per year</Option>
                                <Option value="OncePerTerm">Only once per term</Option>
                                <Option value="MustDoAll">Must do all</Option>
                            </Select>
                        </div>
                        <p className="mt-5 text-sm text-gray-600">
                            <em><strong>Required</strong></em>: Is <strong>payment</strong> required for this club?
                        </p>
                        <Checkbox
                            color={data.is_paid ? "green" : ""}
                            checked={data.is_paid}
                            onChange={() => { setData("is_paid", !data.is_paid) }}
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow-sm mt-2 p-6 ">
                        <Typography
                            variant="h4"
                        >
                            Set global capacity?
                        </Typography>
                        <p className="mt-1 text-sm text-gray-600 mb-4">
                            You can set a global capacity for all club instances.
                        </p>

                        <div className="flex gap-20 items-center">
                            <div className="w-32">
                                <Input
                                    type="number"
                                    className="focus:outline-none " // Adjust the width as needed, for example, "w-32" for 32px width
                                    placeholder="Unlimited"
                                    label="Default Capacity"
                                    value={defaultCapacity}
                                    onChange={(e) => {
                                        const valueToPut = e.target.value == "" ? null : e.target.value;
                                        setDefaultCapacity(valueToPut);
                                    }}
                                />
                            </div>
                            <Button
                                color="blue"
                                variant="text"
                                size="lg"
                                // className="w-1/5"
                                onClick={() => {
                                    const updatedInstances = data.instances.map((instance) => {

                                        return {
                                            ...instance,
                                            capacity: defaultCapacity
                                        };

                                    });
                                    setData({ ...data, instances: updatedInstances });
                                }}
                            >
                                Set
                            </Button>
                        </div>

                    </div>
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

                                const numberOfTimesClubRunInTerm = data.instances.filter(instance =>
                                    instance.half_term == term
                                ).filter(instance => instance.year_groups.length).length

                                return (
                                    <div key={index}>
                                        <div className="bg-white rounded-lg shadow-sm p-3">
                                            <div className="flex justify-between items-center "  >
                                                <div className="flex gap-4 items-center">
                                                    <Typography variant="h5" className="tracking-widest uppercase font-black">Term {term}</Typography>
                                                    {
                                                        numberOfTimesClubRunInTerm ?
                                                            <Tooltip
                                                                content={`This club will run on ${numberOfTimesClubRunInTerm} different days in this term`}

                                                            >
                                                                <Chip
                                                                    value={`${numberOfTimesClubRunInTerm} instances`}
                                                                    color="green"
                                                                />
                                                            </Tooltip>
                                                            :
                                                            <Tooltip
                                                                content={`This club will not run during this term`}

                                                            >
                                                                <Chip
                                                                    value={`${numberOfTimesClubRunInTerm} instances`}
                                                                    color="red"

                                                                />
                                                            </Tooltip>
                                                    }

                                                    <div className="flex gap-1">
                                                        {
                                                            data.instances.filter(instance =>
                                                                instance.half_term == term
                                                            ).map(instance => (
                                                                instance.year_groups.length ?
                                                                    <Tooltip
                                                                        content={"Years " + JSON.stringify(instance.year_groups)}
                                                                    >
                                                                        <Chip
                                                                            value={instance.day_of_week.substring(0, 3)}
                                                                            variant="ghost"
                                                                            color="green"
                                                                        // icon={
                                                                        //     <Checkbox
                                                                        //         color="green"
                                                                        //         ripple={false}
                                                                        //         checked={true}
                                                                        //         disabled
                                                                        //         containerProps={{ className: "p-0" }}
                                                                        //         className="-ml-px border-2 border-green-900 before:hidden checked:border-green-900 checked:bg-green-900"
                                                                        //     />
                                                                        // }
                                                                        />
                                                                    </Tooltip>
                                                                    : <Tooltip
                                                                        content="No year groups selected"
                                                                    >
                                                                        <Chip
                                                                            value={instance.day_of_week.substring(0, 3)}
                                                                            variant="ghost"
                                                                            color="red"
                                                                        // icon={
                                                                        //     <Checkbox
                                                                        //         color="red"
                                                                        //         ripple={false}
                                                                        //         checked={false}
                                                                        //         disabled
                                                                        //         containerProps={{ className: "p-0" }}
                                                                        //         className="-ml-px border-2 border-red-900 before:hidden checked:border-green-900 checked:bg-green-900"
                                                                        //     />
                                                                        // }
                                                                        />
                                                                    </Tooltip>
                                                            ))
                                                        }
                                                    </div>
                                                    <Button
                                                        variant="text"
                                                        size="sm"
                                                        color="red"
                                                        onClick={() => {
                                                            const updatedInstances = data.instances.map((instance) => {


                                                                if (instance.half_term === term) {
                                                                    return {
                                                                        ...instance,
                                                                        year_groups: [],
                                                                    };
                                                                }
                                                                return instance;
                                                            });
                                                            setData({ ...data, instances: updatedInstances });

                                                        }}
                                                    >
                                                        Remove all
                                                    </Button>
                                                    <Button
                                                        variant="text"
                                                        size="sm"
                                                        onClick={() => {
                                                            const updatedInstances = data.instances.map((instance) => {

                                                                if (instance.half_term === term) {

                                                                    const eligibleYears = [7, 8, 9, 10, 11].filter(yearGroup => {
                                                                        const aDs = availableDays.filter(aV => aV.year == yearGroup)[0]
                                                                        return aDs.days_array.includes(instance.day_of_week);
                                                                    });

                                                                    return {
                                                                        ...instance,
                                                                        year_groups: eligibleYears,
                                                                    };
                                                                }
                                                                return instance;
                                                            });
                                                            setData({ ...data, instances: updatedInstances });
                                                        }}
                                                    >
                                                        Add all
                                                    </Button>
                                                </div>
                                                <Button
                                                    color=""
                                                    variant="outlined"
                                                    onClick={() => toggleCard(index)}
                                                >
                                                    {isOpen ? (
                                                        <div className="flex gap-2 items-center">
                                                            Close
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={2.3}
                                                                stroke="currentColor"
                                                                className="w-6 h-6"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M4.5 15.75l7.5-7.5 7.5 7.5"
                                                                />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-2 items-center">
                                                            Open
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={2.3}
                                                                stroke="currentColor"
                                                                className="w-6 h-6"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </Button>

                                            </div>
                                            <div className="flex gap-1 mt-4">
                                                {
                                                    [7, 8, 9, 10, 11].map(yearGroup =>
                                                        [...new Set(data.instances.filter(instance => instance.half_term == term).flatMap(i => i.year_groups))]
                                                            .includes(yearGroup) ?
                                                            <Tooltip
                                                                content={`Available to this year group on days ${JSON.stringify(
                                                                    data.instances.filter(instance => instance.half_term == term)
                                                                        .filter(instance => instance.year_groups.includes(yearGroup)).flatMap(i => i.day_of_week)
                                                                )}`}
                                                            >
                                                                <Chip
                                                                    value={`Year ${yearGroup}`}
                                                                    variant="ghost"
                                                                    color="green"
                                                                // className= text-center"
                                                                // icon={
                                                                //     <Checkbox
                                                                //         color="green"
                                                                //         ripple={false}
                                                                //         checked={true}
                                                                //         disabled
                                                                //         containerProps={{ className: "p-0" }}
                                                                //         className="-ml-px border-2 border-green-900 before:hidden checked:border-green-900 checked:bg-green-900"
                                                                //     />
                                                                // }
                                                                />
                                                            </Tooltip>
                                                            :
                                                            <Chip
                                                                value={`Year ${yearGroup}`}
                                                                variant="ghost"
                                                                color="red"
                                                            // className= text-center"
                                                            // icon={
                                                            //     <Checkbox
                                                            //         color="green"
                                                            //         ripple={false}
                                                            //         checked={true}
                                                            //         disabled
                                                            //         containerProps={{ className: "p-0" }}
                                                            //         className="-ml-px border-2 border-green-900 before:hidden checked:border-green-900 checked:bg-green-900"
                                                            //     />
                                                            // }
                                                            />
                                                    )
                                                }
                                            </div>
                                        </div>

                                        <Collapse open={isOpen} className="mt-3 mb-3" key={index} >
                                            <div className="bg-white p-4 rounded-lg shadow-md mb-1 ">
                                                <Typography variant="h4">Instances</Typography>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    Modify more closely and in more detail exactly when and for whom <strong>{data.name ? data.name : "Unnamed Club"} </strong> is run.
                                                </p>
                                                {
                                                    availableDaysForBooking.map(day => {

                                                        const instanceData = data.instances.filter(instance =>
                                                            instance.half_term == term && instance.day_of_week == day
                                                        )[0];
                                                        
                                                        console.log(data.instances);
                                                        console.log("looking for", term, day ,instanceData);

                                                        
                                                        return (
                                                            <div className="mb-3 mt-3 border-t" key={`${index}-${day}`}>

                                                                <div className="flex gap-4 items-baseline">
                                                                    <Typography variant="h6" className="mt-2">
                                                                        Term {term} - {day}
                                                                    </Typography>
                                                                    {
                                                                        !instanceData.year_groups.length &&
                                                                        <p className="mt-1 text-sm text-red-600 font-bold">
                                                                            This club will not run on this day
                                                                        </p>
                                                                    }
                                                                </div>

                                                                <p className="mt-1 text-sm text-gray-600">
                                                                    For which year groups is this club eligible?
                                                                </p>

                                                                <div className="flex gap-3 ">
                                                                    {
                                                                        [7, 8, 9, 10, 11].map(yearGroup => {

                                                                            const isDayYearGroupEligible = availableDays.filter(aV => aV.year == yearGroup)[0]
                                                                                .days_array.includes(day);

                                                                            return (
                                                                                isDayYearGroupEligible ?
                                                                                    <ListItem key={`${index}-${day}-${yearGroup}`} className="p-0 w-20">
                                                                                        <label className="flex w-full cursor-pointer items-center px-3 py-2">
                                                                                            <ListItemPrefix className="mr-1">
                                                                                                <Checkbox
                                                                                                    checked={instanceData.year_groups.includes(yearGroup)}
                                                                                                    onChange={() => {
                                                                                                        const updatedInstances = data.instances.map((instance) => {
                                                                                                            if (instance.half_term === term && instance.day_of_week === day) {
                                                                                                                if (instance.year_groups.includes(yearGroup)) {
                                                                                                                    return {
                                                                                                                        ...instance,
                                                                                                                        year_groups: instance.year_groups.filter(yg => yg !== yearGroup),
                                                                                                                    };
                                                                                                                } else {
                                                                                                                    return {
                                                                                                                        ...instance,
                                                                                                                        year_groups: [...instance.year_groups, yearGroup],
                                                                                                                    };
                                                                                                                }
                                                                                                            }
                                                                                                            return instance;
                                                                                                        });
                                                                                                        setData({ ...data, instances: updatedInstances });
                                                                                                    }}
                                                                                                />
                                                                                            </ListItemPrefix>
                                                                                            <Typography
                                                                                                color="blue-gray"
                                                                                                className="font-medium"
                                                                                            >
                                                                                                {yearGroup}
                                                                                            </Typography>
                                                                                        </label>
                                                                                    </ListItem>
                                                                                    :
                                                                                    <></>
                                                                            )

                                                                        })
                                                                    }

                                                                    <Button
                                                                        variant="text" color="blue" size="sm"
                                                                        onClick={() => {
                                                                            const updatedInstances = data.instances.map((instance) => {

                                                                                const eligibleYears = [7, 8, 9, 10, 11].filter(yearGroup => {
                                                                                    const aDs = availableDays.filter(aV => aV.year == yearGroup)[0]
                                                                                    return aDs.days_array.includes(day);
                                                                                });

                                                                                if (instance.half_term === term && instance.day_of_week === day) {
                                                                                    return {
                                                                                        ...instance,
                                                                                        year_groups: instance.year_groups.length < eligibleYears.length ? eligibleYears : [],
                                                                                    };
                                                                                }
                                                                                return instance;
                                                                            });
                                                                            setData({ ...data, instances: updatedInstances });
                                                                        }}
                                                                    >Toggle all</Button>
                                                                </div>
                                                                <p className="mt-1 text-sm text-gray-600 mb-3">
                                                                    Enter capacity. Leave blank for unlimited.
                                                                </p>
                                                                <TextInput
                                                                    type="number"
                                                                    placeholder="Unlimited"
                                                                    value={instanceData.capacity == null ? "" : instanceData.capacity}
                                                                    onChange={(e) => {
                                                                        const updatedInstances = data.instances.map((instance) => {
                                                                            if (instance.half_term === term && instance.day_of_week === day) {

                                                                                const valueToPut = e.target.value == "" ? null : e.target.value

                                                                                return {
                                                                                    ...instance,
                                                                                    capacity: valueToPut
                                                                                };
                                                                            }
                                                                            return instance;
                                                                        });
                                                                        setData({ ...data, instances: updatedInstances });
                                                                    }}
                                                                />
                                                                <div className="flex flex-col items-end bg-gray-50 mt-2 p-4 rounded-lg">
                                                                    <p className="mt-4 text-sm text-gray-600  font-bold">
                                                                        Copy across to all other terms?
                                                                    </p>
                                                                    <p className="mt-1 text-sm text-gray-600 mb-3 ">
                                                                        Save time and apply this configuration for a {day} across all terms
                                                                    </p>
                                                                    <Button variant="outlined" color="blue"
                                                                        onClick={(e) => {
                                                                            const thisDayYearGroups = instanceData.year_groups;
                                                                            const thisDayCapacity = instanceData.capacity;

                                                                            const updatedInstances = data.instances.map((instance) => {

                                                                                if(instance.day_of_week == instanceData.day_of_week) {
                                                                                    return {
                                                                                        ...instance,
                                                                                        capacity: thisDayCapacity,
                                                                                        year_groups: thisDayYearGroups
                                                                                    }
                                                                                }
                                                                                return instance;
                                                                            })

                                                                        setData({ ...data, instances: updatedInstances });

                                                                        }}
                                                                    >
                                                                        Copy Now
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>

                                        </Collapse>
                                    </div>
                                );
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
                        <Button className=" mb-4" color="blue" onClick={() => {
                            post(route("admin.clubs.create"), {
                                onSuccess: () => reset(),
                                onError: (error) => {
                                }
                            })
                        }}> Add Club </Button>
                    </div>
                </div>

            </form>

        </AuthenticatedLayout>
    );
}
