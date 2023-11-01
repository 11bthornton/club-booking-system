import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Typography } from "@material-tailwind/react"

import { Head } from "@inertiajs/react"

export default function Maintenance({ auth }) {
    return(
        <AuthenticatedLayout
            user={auth.user}
            header="Maintenance"
        >
        <Head title="Maintenance" />
            <div className="container p-6 mx-auto  mt-4">
                <Typography variant="h2">
                   The system is currently under maintenance, check back later
                </Typography>
            </div>
        </AuthenticatedLayout>
    )
}