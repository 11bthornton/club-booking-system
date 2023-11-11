import { Chip, Checkbox, Tooltip, Button, ListItem, ListItemPrefix, Collapse, Typography } from "@material-tailwind/react";
import TextInput from "@/Components/TextInput";

export default function ClubInTermCard({ availableDays, availableDaysForBooking, index, term, numberOfTimesClubRunInTerm, data, setData, isOpen, toggleCard }) {
    return (
        <div key={index}>
            <div className="bg-white rounded-lg shadow-sm p-3">
                <div className="flex justify-between items-center ">
                    <div className="flex gap-4 items-center">
                        <Typography variant="h5" className="tracking-widest uppercase font-black">Term {term}</Typography>
                        {numberOfTimesClubRunInTerm ?
                            <Tooltip
                                content={`This club will run on ${numberOfTimesClubRunInTerm} different days in this term`}
                            >
                                <Chip
                                    value={`${numberOfTimesClubRunInTerm} instances`}
                                    color="green" />
                            </Tooltip>
                            :
                            <Tooltip
                                content={`This club will not run during this term`}

                            >
                                <Chip
                                    value={`${numberOfTimesClubRunInTerm} instances`}
                                    color="red" />
                            </Tooltip>}

                        <div className="flex gap-1">
                            {data.instances.filter(instance => instance.half_term == term
                            ).map(instance => (
                                instance.year_groups.length ?
                                    <Tooltip
                                        content={"Years " + JSON.stringify(instance.year_groups)}
                                    >
                                        <Chip
                                            value={instance.day_of_week.substring(0, 3)}
                                            variant="ghost"
                                            color="green" />
                                    </Tooltip>
                                    : <Tooltip
                                        content="No year groups selected"
                                    >
                                        <Chip
                                            value={instance.day_of_week.substring(0, 3)}
                                            variant="ghost"
                                            color="red" />
                                    </Tooltip>
                            ))}
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
                                            const aDs = availableDays.filter(aV => aV.year == yearGroup)[0];
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
                                        d="M4.5 15.75l7.5-7.5 7.5 7.5" />
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
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        )}
                    </Button>

                </div>
                <div className="flex gap-1 mt-4">
                    {[7, 8, 9, 10, 11].map(yearGroup => [...new Set(data.instances.filter(instance => instance.half_term == term).flatMap(i => i.year_groups))]
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
                                color="green" />
                        </Tooltip>
                        :
                        <Chip
                            value={`Year ${yearGroup}`}
                            variant="ghost"
                            color="red" />
                    )}
                </div>
            </div>

            <Collapse open={isOpen} className="mt-3 mb-3" key={index}>
                <div className="bg-white p-4 rounded-lg shadow-md mb-1 ">
                    <Typography variant="h4">Instances</Typography>
                    <p className="mt-1 text-sm text-gray-600">
                        Modify more closely and in more detail exactly when and for whom <strong>{data.name ? data.name : "Unnamed Club"} </strong> is run.
                    </p>
                    {availableDaysForBooking.map(day => {

                        const instanceData = data.instances.filter(instance => instance.half_term == term && instance.day_of_week == day
                        )[0];




                        return (
                            <div className="mb-3 mt-3 border-t" key={`${index}-${day}`}>

                                <div className="flex gap-4 items-baseline">
                                    <Typography variant="h6" className="mt-2">
                                        Term {term} - {day}
                                    </Typography>
                                    {!instanceData.year_groups.length &&
                                        <p className="mt-1 text-sm text-red-600 font-bold">
                                            This club will not run on this day
                                        </p>}
                                </div>

                                <p className="mt-1 text-sm text-gray-600">
                                    For which year groups is this club eligible?
                                </p>

                                <div className="flex gap-3 ">
                                    {[7, 8, 9, 10, 11].map(yearGroup => {

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
                                                                }} />
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
                                        );

                                    })}

                                    <Button
                                        variant="text" color="blue" size="sm"
                                        onClick={() => {
                                            const updatedInstances = data.instances.map((instance) => {

                                                const eligibleYears = [7, 8, 9, 10, 11].filter(yearGroup => {
                                                    const aDs = availableDays.filter(aV => aV.year == yearGroup)[0];
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

                                                const valueToPut = e.target.value == "" ? null : e.target.value;

                                                return {
                                                    ...instance,
                                                    capacity: valueToPut
                                                };
                                            }
                                            return instance;
                                        });
                                        setData({ ...data, instances: updatedInstances });
                                    }} />
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

                                                if (instance.day_of_week == instanceData.day_of_week) {
                                                    return {
                                                        ...instance,
                                                        capacity: thisDayCapacity,
                                                        year_groups: thisDayYearGroups
                                                    };
                                                }
                                                return instance;
                                            });

                                            setData({ ...data, instances: updatedInstances });

                                        }}
                                    >
                                        Copy Now
                                    </Button>
                                </div>
                            </div>
                        );
                    })}

                </div>

            </Collapse>
        </div>
    );
}
