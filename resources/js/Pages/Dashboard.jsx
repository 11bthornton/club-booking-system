
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import { Alert, Button } from '@material-tailwind/react';
import { Typography } from '@material-tailwind/react';
import { Card, CardBody, CardHeader } from '@material-tailwind/react';

import { Link } from "@inertiajs/inertia-react";

export default function Dashboard({
    auth,
    bookedClubInstances,
    clubInformation,
    error,
}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Home{" "}
                </h2>
            }
        >
            <Head title="Home" />

            <div className=" pt-8 pb-14">
                <div className="container mx-auto px-4">
                    <Card>
                        <CardBody >
                            <Typography variant="h2" color="blue-gray" className="mb-4 font-bold ">
                                Bethany - Club Booking System
                            </Typography>
                            <Alert className="mb-4 mt-2" color="orange" variant="ghost">
                                <Typography variant="h5" className="text-center">
                                    Please read and make sure you have understood this page before continuing
                                </Typography>
                            </Alert>

                            <div className="mb-4">
                                <Typography variant="h5">
                                    What is this site?
                                </Typography>
                                <Typography className="mb-2">
                                    At certain times during the year, you will be able to logon to this site and select/change your after school clubs for each term.
                                    This site was designed so you can easily check which clubs you have signed up for and when, but also to speed up and simplify the booking process.
                                    <br />
                                    <br />
                                    While you won't always be able to book clubs, you will always be able to logon to this site and view clubs you have already booked.
                                </Typography>
                            </div>

                            <div className="mb-4">
                                <Typography variant="h5">
                                    Which clubs are available to me?
                                </Typography>
                                <Typography className="mb-2">
                                    The clubs which are available to you depend on which year group you are in. You will only be shown the clubs for which you are eligible to join.
                                </Typography>
                            </div>

                            <div className="mb-4">
                                <Typography variant="h5">
                                    Do clubs have capacities?
                                </Typography>
                                <Typography className="mb-2">
                                    Yes, if applicable, each club (for each time it is run) will have its remaining capacity clearly stated. This system operates a first come, first served policy. So think twice before you remove a booking
                                </Typography>
                            </div>

                            <div className="mb-4">
                                <Typography variant="h5">
                                    When and how will I be able to book clubs?
                                </Typography>
                                <Typography className="mb-2">
                                    The system will be "live" at specific periods during the year. You will be told exactly when via email. During these periods you will be able to make changes to your bookings for all/some terms across
                                    the academic year. At the beginning of the year, you will be able to book clubs across all terms. Then, during the year, the system may be opened up again so you can edit your choices.

                                </Typography>
                                <img src="/bookingsclosed.png" alt="" width={700} />
                                <Typography className="mb-2">
                                    On the booking page, each term will look like the above image. You will be told whether you are currently able to book clubs for this term. If a booking period is scheduled to open soon, you will be shown a countdown.
                                    If the booking system is open for that particular term, you will shown a countdown which indicates how long you have left to make your changes before the system shuts.

                                </Typography>
                                <img src="/bookingsopen.png" alt="" width={700} />
                                <Typography className="mt-4">
                                    Clicking on the button at the bottom of each club will then display a list of clubs that are eligible for you to select. If you choose to select a club, you will first be shown a confirmation that clearly spells
                                    out how this change will affect your current bookings (if any). Hitting confirm will update the page.
                                </Typography>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center w-full">
                                    <img src="/options.png" alt="" width={400} />
                                    <img src="/confirm.png" alt="" width={400} />


                                </div>
                                <Typography className="mt-4">
                                    Your place is confirmed on a club when you see the relevant card filled in on your page:
                                </Typography>
                                <img src="/filledoption.png" alt="" width={400} className="mt-2"/>
                                Your place is confirmed, and it is yours until you delete it.
                            </div>

                            <div className="mb-4">
                                <Typography variant="h5">
                                    What if I delete a booking?
                                </Typography>
                                <Typography className="mb-2">
                                    Your place is lost until you book it again. Note that, as mentioned here, clubs do have capacities. If you delete a booking, there is a chance that
                                    the club will have reached capacity before you are able to re-book.
                                </Typography>
                            </div>

                            <div className="mb-4">
                                <Typography variant="h5">
                                    Are there any rules I should know about?
                                </Typography>
                                <Typography className="mb-2">
                                    Yes. Some clubs you can book as many times as you would like across the academic year. Some are restricted to only once per term, and others are only restricted to once per academic year.
                                    <br />
                                    <strong className="font-black">The system will not allow you to break these rules. </strong> If you try to book a limited club more than once, you will be booked onto the new date, and your old booking will be removed.
                                </Typography>
                            </div>
                            <div className="mb-4">
                                <Typography variant="h5">
                                    Do some clubs require commitment?
                                </Typography>
                                <Typography className="mb-2">
                                    Yes. If you select clubs for one date, you will be booked on all the other dates that are also required. For instance, a club might require you all wednesdays across the entire year. Likewise, if you remove one of these days from your
                                    bookings, all the others will be removed.
                                </Typography>
                            </div>

                            <div className="mb-4">
                                <Typography variant="h5">
                                    What if I've forgotten my password?
                                </Typography>
                                <Typography className="mb-2">
                                    The site admin can change it for you, send an email to email@email.com. &nbsp;
                                    <strong>Remember</strong>, you can always change it yourself using the links provided at the top of the page.
                                </Typography>
                            </div>

                            <div className="mb-4">
                                <Typography variant="h5">
                                    Do I have to select a club?
                                </Typography>
                                <Typography className="mb-2">
                                    No, you will be allocated "Home" otherwise.
                                </Typography>
                            </div>

                            <div className="flex justify-center">
                                <Link
                                    href={route("club.market")}>
                                    <Button
                                        color="lightBlue"
                                        buttonType="filled"
                                        size="regular"
                                        rounded={false}
                                        block={false}
                                        iconOnly={false}
                                        ripple="light"
                                        className="mt-4"
                                    >
                                        Go to Club Market
                                    </Button>
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
