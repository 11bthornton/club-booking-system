import React from "react";
import { Chip } from "@material-tailwind/react";


export function ChipWithStatus() {
    return (
        <div className="flex gap-2">
            <Chip
                variant="ghost"
                color="green"
                size="sm"
                value="System Live"
                icon={<span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-green-900 content-['']" />} />
        </div>
    );
}
