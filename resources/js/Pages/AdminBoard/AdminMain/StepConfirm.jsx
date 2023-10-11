import React from "react";
import { useStep } from "./StepContext";

import { Alert, Typography } from "@material-tailwind/react";

export default function StepConfirm() {
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
            <div className="flex justify-between items-center">
                <Typography variant="h2" className="font-bold ">
                    Confirm
                </Typography>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-12 h-12"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>

            <div className="mt-4">
                <div>
                    <Typography variant="body1">
                        <strong>Start Time: </strong>{" "}
                        {formData.start_time || "N/A"}
                    </Typography>
                </div>
                <div>
                    <Typography variant="body1">
                        <strong>Start Date: </strong>{" "}
                        {formData.start_date || "N/A"}
                    </Typography>
                </div>
                <div>
                    <Typography variant="body1">
                        <strong>End Time: </strong> {formData.end_time || "N/A"}
                    </Typography>
                </div>
                <div>
                    <Typography variant="body1">
                        <strong>End Date: </strong> {formData.end_date || "N/A"}
                    </Typography>
                </div>
                <div>
                    <Typography variant="body1">
                        <strong>Year Groups: </strong>{" "}
                        {formData.year_groups.length > 0
                            ? formData.year_groups.join(", ")
                            : "N/A"}
                    </Typography>
                </div>
                <div>
                    <Typography variant="body1">
                        <strong>Clubs: </strong>{" "}
                        {formData.clubs.length > 0
                            ? formData.clubs.join(", ")
                            : "N/A"}
                    </Typography>
                </div>
            </div>
        </>
    );
}
