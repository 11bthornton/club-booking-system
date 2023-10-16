import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head } from "@inertiajs/react";
import React, { useEffect, useRef } from "react";

import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { Alert, Button, Checkbox, Radio } from '@material-tailwind/react'

import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { useSpinner } from "@/LoadingContext";

import { Transition } from "@headlessui/react";

export default function YearConfigure({ auth }) {

    const {
        data,
        setData,
        post,
        processing,
        reset,
        errors,
        recentlySuccessful
    } = useForm({
        yearStart: "23",
        yearEnd: "24",
    });

    const { setShowSpinner } = useSpinner();

    useEffect(() => {
        setShowSpinner(processing);
    }, [processing]);

    const [transferUsers, setTransferUsers] = useState(false);
    const yearEndInput = useRef();

    return (
        <AuthenticatedLayout user={auth.user} header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Configure a New Academic Year
            </h2>
        }>
            <Head title="Configure Year" />

            <div className="py-12 sm:p-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className=" bg-green-500 shadow sm:rounded-lg">

                            <Alert
                                color="green"
                                variant="ghost"
                            >
                                <p className="text-white">
                                    Successfully saved configuration.
                                </p>
                            </Alert>
                        </div>
                    </Transition>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h2 className="text-lg font-medium text-gray-900">
                            Year Dates
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 mb-4">
                            Set the academic year start and year end. E.g. 23 for 2023.
                        </p>

                        <InputLabel
                            htmlFor="year-start"
                            value="Year Start"
                        />

                        <TextInput
                            id="year-start"
                            type="number"
                            className="w-1/5 mb-4"
                            value={data.yearStart}
                            onChange={(e) => {
                                setData("yearStart", e.target.value)
                            }
                            }
                            aria-required
                        />

                        <InputLabel
                            htmlFor="year-end"
                            value="Year End"
                        />

                        <TextInput
                            id="year-end"
                            type="number"
                            value={data.yearEnd}
                            className="w-1/5 mb-1"
                            onChange={(e) => {
                                setData("yearEnd", e.target.value)
                            }
                            }
                            aria-required
                        />
                        {
                            errors.yearEnd ?  
                                <p className="mt-1 text-sm text-red-600 mb-4 font-bold">
                                    {errors.yearEnd}
                                </p> 
                            :   
                                <>
                                </>
                        }

                        <p className="mt-1 text-sm text-gray-600 mb-2">
                            Now set the term dates, these are purely for visual purposes and only convey information to the students
                            when they're booking their clubs.
                        </p>

                        {
                            // [1, 2, 3, 4, 5, 6].map(term => (
                            //     <div class="grid grid-cols-6 gap-4">

                            //         <div className="flex flex-col">
                            //             <InputLabel
                            //                 htmlFor="year-end"
                            //                 value={`Term ${term}`}
                            //             />

                            //             <TextInput
                            //                 id="year-end"
                            //                 type="number"
                            //                 value={data.yearEnd}
                            //                 onChange={(e) => {
                            //                     setData("yearEnd", e.target.value)
                            //                 }
                            //                 }
                            //                 aria-required
                            //             />
                            //         </div>
                            //     </div>
                            // ))
                        }
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h2 className="text-lg font-medium text-gray-900">
                            Students
                        </h2>
                        <p className="mt-1 mb-4 text-sm text-gray-600">
                            You can opt to transfer across (current) years 7-10 through to the next academic year,
                            with each student retaining the same login information. Or, instead, you can upload
                            a csv for the students you need for this academic year. With this option, students will be
                            provided with new login information. Naturally, this option will be required for the first year
                            the system is run.
                        </p>
                        <InputLabel
                            value="Transfer across from academic year _?"
                            check
                        />
                        <div className="flex gap-3">
                            <Radio
                                name="type"
                                label="No"
                            />
                            <Radio
                                name="type"
                                label="Yes"
                                defaultChecked
                            />
                        </div>

                        <p className="mt-4 mb-4 text-sm text-gray-600 min-">
                            {
                                transferUsers ?
                                    <span>
                                        Upload file with any new users you have to add. Users in Years 7-10 from the previous academic year, _, will move
                                        up a year and retain the same login information.
                                    </span>
                                    :
                                    <span>
                                        Upload file with all new users.
                                    </span>
                            }
                            <br />
                            <br />
                            <a href="" className="text-blue-400 hover:underline">What format should this data be supplied in?</a>
                        </p>

                        <Button variant="outlined" size="sm">
                            Upload
                        </Button>

                        <p className="mt-4  text-sm text-red-600 font-bold">
                            Users in Year 11 already in the system from previous academic year(s) will be deleted.
                        </p>
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h2 className="text-lg font-medium text-gray-900">
                            Clubs
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Similarly, opt to use the same clubs
                        </p>
                    </div>
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h2 className="text-lg font-medium text-gray-900">
                            Submit
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 mb-4">
                            Check over your settings and press submit.
                        </p>
                        <Button
                            size="md"
                            onClick={() => {
                                post(route('admin.academic-year.store'), {

                                })
                            }}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}