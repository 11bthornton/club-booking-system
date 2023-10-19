import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head } from "@inertiajs/react";

import { useForm } from "@inertiajs/react";
import { Alert, Button, Checkbox, Option, Select, Textarea, Typography, Input } from "@material-tailwind/react";

import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";


import { Transition } from "@headlessui/react";

export default function ClubShow({ auth, club, uniqueUsers, successFromInsert }) {
    const [defaultCapacity, setDefaultCapacity] = useState(20);

    const {
        data,
        setData,
        errors,
        post,
        reset,
        put,
        processing,
        recentlySuccessful,
    } = useForm({
        clubTitle: club.name,
        clubDescription: club.description,
        clubRules: club.rules,
        ruleChoice: "",
        instances: club.club_instances.map(instance => ({
            ...instance,
            year_groups: instance.year_groups.map(y => Number(y.year)),
            // If you want to remove the old field, you can omit it
        })),
        compatibilities: {
            "in": [],
            "must": []
        },
    })

    function cartesianProduct() {
        const numbers = [...Array(12).keys()].map(i => i + 1); // Generate numbers from 1 to 12
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
                        "in": [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12]],
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
                    Update club - {club.name}
                </h2>
            }
        >
            <Head title="Update Club" />
            
            <form>
                <div className="container mx-auto flex-col gap-4">
                    <div className="bg-white mt-4 p-6 rounded-lg shadow-sm">

                        
                            {successFromInsert && <Alert
                                variant="ghost"
                                color="green"
                                className="mb-5"
                            >
                                Club successfully saved! You can now view and edit below.
                            </Alert>}

                        {
                            route().current() == "admin.clubs.index" ?
                                <>
                                    <Typography
                                        variant="h2"
                                        className="mb-2"
                                    >
                                        Update club
                                    </Typography>
                                    <p className="mt-1 text-sm text-gray-600 mb-4">
                                        Don't forget to press save at the bottom of the page.
                                    </p>
                                </>
                                :
                                <>

                                </>
                        }
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Club Name"
                            />

                            <TextInput
                                id="name"
                                className="w-2/5 mb-4"
                                value={data.clubTitle}
                                onChange={(e) =>
                                    setData("clubTitle", e.target.value)
                                }
                                aria-required
                            />
                        </div>
                        <div>
                            <Textarea
                                id="description"
                                label="Club Description"
                                className="w-2/5"
                                value={data.clubDescription}
                                onChange={(e) =>
                                    setData("clubDescription", e.target.value)
                                }
                                aria-required
                            />
                        </div>
                        <div>
                            <Textarea
                                id="rules"
                                label="Rule Description"
                                className="w-2/5"
                                value={data.clubRules}
                                onChange={(e) =>
                                    setData("clubRules", e.target.value)
                                }
                            />
                        </div>
                        <div className="mt-2">
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

                    </div>
                    <div className="bg-white rounded-lg shadow-sm mt-4 p-4 flex flex-col gap-5">
                        <Typography
                            variant="h4"
                        >
                            Set capacity for all clubs:
                        </Typography>

                        <Input
                            type="number"
                            className="focus:outline-none"
                            label="Capacity - (blank for unlimited)"
                            value={defaultCapacity}
                            onChange={(e) => {
                                const valueToPut = e.target.value == "" ? null : e.target.value;
                                setDefaultCapacity(valueToPut);

                            }}
                        />

                        <Button
                            color="blue"
                            variant="outlined"
                            size="lg"
                            className="w-1/5"
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
                    <div className="mt-4">
                        <div class="grid grid-cols-2 grid-rows-3 gap-4">
                            {
                                [1, 2, 3, 4, 5, 6].map(term => (
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <Typography variant="h4">
                                                Term {term}
                                            </Typography>
                                        </div>
                                        <div className="flex flex-col gap-5">
                                            {
                                                ["Wednesday", "Friday"].map(day => {

                                                    const clubInstance = data.instances.filter(
                                                        instance => instance.half_term == term && instance.day_of_week == day
                                                    )[0]
                                                        
                                                    if(!clubInstance) {
                                                        return <></>;
                                                    }

                                                    return (
                                                        <div className="">
                                                            <Typography variant="h5" className="mb-2">
                                                                {day}
                                                            </Typography>
                                                            {
                                                                JSON.stringify(clubInstance.year_groups)
                                                            }
                                                            <Input
                                                                type="number"
                                                                className="focus:outline-none"
                                                                label="Capacity - (blank for unlimited)"
                                                                value={clubInstance.capacity === null ? "" : clubInstance.capacity}
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

                                                            <p className="mt-3">Eligible to:</p>

                                                            <div className="flex justify-between">
                                                                <div className="flex gap-2 items-center">

                                                                    <Checkbox
                                                                        checked={clubInstance.year_groups.map(y => Number(y.year)).length == 5}
                                                                        onChange={() => {
                                                                            const updatedInstances = data.instances.map((instance) => {
                                                                                if (instance.half_term === term && instance.day_of_week === day) {
                                                                                    return {
                                                                                        ...instance,
                                                                                        year_groups: [7, 8, 9, 10, 11],
                                                                                    };
                                                                                }
                                                                                return instance;
                                                                            });
                                                                            setData({ ...data, instances: updatedInstances });
                                                                        }}
                                                                    />
                                                                    <p>All Year Groups</p>
                                                                </div>
                                                                <Button
                                                                    color="red"
                                                                    variant="text"
                                                                    onClick={() => {
                                                                        const updatedInstances = data.instances.map((instance) => {
                                                                            if (instance.half_term === term && instance.day_of_week === day) {
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
                                                                    Clear Day
                                                                </Button>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                {
                                                                    [7, 8, 9, 10, 11].map(yearGroup => (

                                                                        <div className="flex items-center">
                                                                            <Checkbox
                                                                                checked={clubInstance.year_groups.includes(yearGroup)}
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
                                                                            {yearGroup}
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>

                                                        </div>
                                                    )

                                                })
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <Button className="mt-4 mb-4" color="blue" onClick={() => {

                        if (route().current() != "admin.clubs.index") {
                            post(route("admin.clubs.create"), {
                                onSuccess: () => reset(),
                                onError: () => {
                                }
                            })
                        } else {
                            put(route("admin.clubs.update", {
                                id: club.id
                            }))
                        }
                    }}> Add Club </Button>
                </div>
            </form>

        </AuthenticatedLayout>
    );
}

