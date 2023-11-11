import { Button, Typography } from "@material-tailwind/react"

import { useForm } from "@inertiajs/inertia-react"

export default function ResetSystemView() {

    const { post } = useForm({})

    return (
        <div className="bg-red-50 mt-4 p-4 text-red-500 rounded-lg border-dashed border-6 border shadow-lg">
            <Typography
                variant="h4"
                className="tracking-widest uppercase"
            >
                Danger Zone
            </Typography>
            <Typography
                variant="h6"
            >
                Reset System
            </Typography>
            <p className="mt-1 text-sm text-gray-600 mb-4">
                Resets the system. Deletes all bookings, clubs, students and academic year configurations. 
            </p>
            <Button
                color="red"
                // variant=""
                size="sm"
                onClick={() => post(route("admin.reset"))}
            >
                Reset
            </Button>

        </div>
    )
}