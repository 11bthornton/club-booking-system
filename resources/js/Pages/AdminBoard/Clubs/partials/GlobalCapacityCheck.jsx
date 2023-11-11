import { Button, Input, Typography } from "@material-tailwind/react";


export default function GlobalCapacityCheck({ data, setData, errors, defaultCapacity, setDefaultCapacity  }) {

    return (
        <div className="bg-white rounded-lg shadow-sm mt-2 p-6 ">
            <Typography
                variant="h4"
            >
                Set global capacity?
            </Typography>
            <p className="mt-1 text-sm text-gray-600 mb-4">
                You can set a global capacity for all club instances.
            </p>
            <p className="mt-1 text-sm text-red-600 mb-4">
                All clubs start out with an unlimited default capacity,
                so make sure to change it if this is not the case,
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
                        }} />
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
    )
}