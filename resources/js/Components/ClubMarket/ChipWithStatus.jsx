import React from "react";
import {
    Chip,
    Tooltip
} from "@material-tailwind/react";


export function ChipWithStatus({ text, color, icon, tooltipContent }) {
    return (
        <Tooltip content={tooltipContent}>
            <Chip
                variant="ghost"
                color={color}
                size="sm"
                value={text}
                icon={icon} />
        </Tooltip>
    );
}
