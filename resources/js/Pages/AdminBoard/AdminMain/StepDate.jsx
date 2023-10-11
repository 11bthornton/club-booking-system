import React from "react";
import { useStep } from "./StepContext";

import { Alert } from "@material-tailwind/react";

export default function StepDate() {
    const { formData, setFormData } = useStep();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <h2 className="text-4xl font-bold mb-2">Select your dates.</h2>
            <Alert
                variant="outlined"
                className="mb-2 mt-9"
                icon={
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                    </svg>
                }
            >
                This takes into account timezone changes. Time selected maps to
                whatever the time is at Bethany on that day.
            </Alert>

            <div className="flex gap-4 justify-center mt-6">
                <div className="flex flex-col items-center gap-10 mb-4 p-5 border-dashed border-2 rounded-xl">
                    <h5 className="text-2xl">
                        When would you like this open period to{" "}
                        <strong className="font-bold">start</strong>?
                    </h5>
                    <div>
                        <input
                            type="date"
                            id="start-date"
                            name="start_date" // matching the name to formData keys
                            value={formData.start_date || ""}
                            onChange={handleInputChange}
                        />
                        <input
                            type="time"
                            id="start-time"
                            name="start_time" // you'd add this to your formData if needed
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-10 mb-4 p-5 border-dashed border-2 rounded-xl">
                    <h5 className="text-2xl">
                        When would you like this open period to{" "}
                        <strong className="font-bold">end</strong>?
                    </h5>
                    <div>
                        <input
                            type="date"
                            id="end-date"
                            name="end_date" // matching the name to formData keys
                            value={formData.end_date || ""}
                            onChange={handleInputChange}
                        />
                        <input
                            type="time"
                            id="end-time"
                            name="end_time" // you'd add this to your formData if needed
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>

            <Progress
                value={
                    (((formData.start_date != null) +
                        (formData.start_time != null) +
                        (formData.end_date != null) +
                        (formData.end_time != null)) /
                        4) *
                    100
                }
                label="Completed"
                // color="green"
                variant="gradient"
                className="mt-6"
                size="lg"
            />
        </>
    );
}

import { Progress } from "@material-tailwind/react";
