/**
 * View for creating a new student 
 */

import { Button } from "@material-tailwind/react";


import { useForm } from "@inertiajs/inertia-react";

export default function StudentCreate({ auth }) {
    
    const { post } = useForm({});

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="p-4 sm:p-8 bg-white shadow-md sm:rounded-lg">
                <h2 className="text-lg font-medium text-gray-900">
                    Create a new user
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Submit a new user or admin
                </p>

                <Button
                    // variant="outlined"
                    className="mt-3"
                    onClick={() => post(route("placeholder"))}                    
                >
                    Save
                </Button>
            </div>
        </div>
    );


}
