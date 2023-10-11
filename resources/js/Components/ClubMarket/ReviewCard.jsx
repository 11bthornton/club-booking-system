import React from "react";
import { Typography } from "@material-tailwind/react";

function ReviewCard() {
    return (
        <div className="flex flex-col gap-2 p-6 rounded-md mt-2 min-h-[60vh] w-[100%] ">
            <div
                className="w-full bg-gray-50 p-6 shadow-sm rounded-lg mb-4 flex items-center  justify-between"
                id={`term-${3}`}
            >
                <div className="flex flex-col">
                    <Typography
                        variant="h2"
                        className="uppercase tracking-widest"
                    >
                        Review
                    </Typography>
                </div>
            </div>
        </div>
    );
}
