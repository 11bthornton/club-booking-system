import {
    Button, Card, CardBody, CardFooter, Typography
} from "@material-tailwind/react";

import { Link } from "@inertiajs/react";

export default function AdminsAdminCard({ }) {

    return (
        <Card className="w-full flex flex-col shadow-lg">
            <CardBody>
                <div className="flex-grow ">
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-12 h-12 mb-4"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <Typography
                            variant="h5"
                            color="blue-gray"
                            className="mb-2 min-h-[60px]"
                        >
                            Admins
                        </Typography>
                    </div>
                    {/* <ChipWithStatus /> */}
                </div>
                <Typography
                    className="min-h-[100px]"
                >
                    Manage admins and admin accounts.
                </Typography>
            </CardBody>
            <CardFooter className="pt-0">
                <div className="flex justify-between items-center">
                    <Link
                        href={route("admin.admins")}
                        className="flex lg:justify-center items-center gap-2"
                    >
                        <Button
                            variant="text"
                            className=""
                        >
                            Take me there
                        </Button>
                    </Link>


                </div>
            </CardFooter>
        </Card>
    )
}