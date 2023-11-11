import {
    Button, Card, CardBody, CardFooter, Typography
} from "@material-tailwind/react";

import { Link } from "@inertiajs/react";

export default function ClubsAdminCard({}) {

    return (
        <Card className="w-full shadow-lg">
            <CardBody>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex justify-between items-start">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="mb-4 w-12 h-12"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            </svg>
                        </div>

                        <div className="flex justify-between items-center">
                            <Typography
                                variant="h5"
                                color="blue-gray"
                                className="mb-2 min-h-[60px]"
                            >
                                Clubs
                            </Typography>
                        </div>
                    </div>

                </div>
                <Typography
                    className="min-h-[100px] overflow-hidden"
                >
                    View clubs, export information and add new ones
                </Typography>
            </CardBody>
            <CardFooter className="pt-0">
                <div className="flex justify-between items-center">
                    <Link
                        href={route("admin.clubs")}
                    >
                        <Button
                            variant="text"
                            className="flex lg:justify-center items-center gap-2"
                        >
                            View All
                        </Button>
                    </Link>
                    <Link
                        href={route("admin.clubs.new")}
                    >

                        <Button
                            variant="text"
                            className="flex lg:justify-center items-center gap-2"
                        >
                            <p>New</p>
                        </Button>
                    </Link>

                </div>
            </CardFooter>
        </Card>
    )
}