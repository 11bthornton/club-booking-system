import { Button, Typography} from "@material-tailwind/react"

export default function DownloadBookingsView({ }) {
    return (
        <div className="bg-white p-4 rounded-lg mt-4 shadow-lg">

            <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-9 h-9">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>

                <Typography
                    variant="h4"

                >
                    Download Student Choices
                </Typography>
            </div>
            <p className="mt-3 text-sm text-gray-600 mb-4">
                {/* When scheduled periods end, this will automatically be emailed to <strong>admin@admin.com</strong> (you can change this in <em>Communication Controls</em>),
                            but you can download them in their current state now. */}
            </p>

            <a href={route('admin.download.total-user-club-spreadsheet')} class="btn btn-primary">
                <Button
                    // variant=""
                    size="sm"
                >
                    Download
                </Button>
            </a>

        </div>
    )
}