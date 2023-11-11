import {
    Button, Card, CardBody, CardFooter, Typography
} from "@material-tailwind/react";

import { Link } from "@inertiajs/react";

export default function HowToAdminCard({ }) {

    return (
        <Card className="w-full shadow-lg">
            <CardBody>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex justify-between items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>

                        </div>

                        <div className="flex justify-between items-center">
                            <Typography
                                variant="h5"
                                color="blue-gray"
                                className="mb-2 min-h-[60px]"
                            >
                                How To
                            </Typography>
                        </div>
                    </div>

                </div>
                <Typography
                    className="min-h-[100px] overflow-hidden"
                >
                    View the admin manual for this site.
                </Typography>
            </CardBody>
            <CardFooter className="pt-0">
                <div className="flex justify-between items-center">
                    <Link
                        href={route("admin.how-to")}
                    >
                        <Button
                            variant="text"
                            className="flex lg:justify-center items-center gap-2"
                        >
                            Take me there
                        </Button>
                    </Link>


                </div>
            </CardFooter>
        </Card>
    )
}