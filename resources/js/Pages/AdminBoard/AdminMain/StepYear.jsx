import React from 'react';
import { useStep } from './StepContext';

import {
    Checkbox,
    List,
    ListItem,
    ListItemPrefix,
    Typography,
} from "@material-tailwind/react";

export default function StepYear() {
    const { formData, setFormData } = useStep();

    const toggleYear = (year) => {
        let newYearGroups = [...formData.year_groups || []]; // Ensure it's an array
        if (newYearGroups.includes(year)) {
            // Remove year if it's already in the array
            newYearGroups = newYearGroups.filter(y => y !== year);
        } else {
            // Add year to array if not included
            newYearGroups.push(year);
        }
        setFormData({ ...formData, year_groups: newYearGroups });
    };

    return (
        <>
            <Typography variant="h2" className="font-bold ">
                Which year groups should this apply to?
            </Typography>
            <p>
                You'll have the option to add / remove individual students later, but you can bulk-include year groups here.
            </p>
            <List>
                {[7, 8, 9, 10, 11].map(year => (
                    <ListItem key={year} className="p-0">
                        <label className="flex w-full cursor-pointer items-center px-3 py-2">
                            <ListItemPrefix className="mr-3">
                                <Checkbox
                                    id={`year-${year}`}
                                    ripple={false}
                                    className="hover:before:opacity-0"
                                    containerProps={{
                                        className: "p-0",
                                    }}
                                    checked={formData.year_groups ? formData.year_groups.includes(year) : false}
                                    onChange={() => toggleYear(year)}
                                />
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="font-medium">
                                {`Year ${year}`}
                            </Typography>
                        </label>
                    </ListItem>
                ))}
            </List>
        </>
    );
}
