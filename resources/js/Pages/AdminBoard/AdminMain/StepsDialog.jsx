import React from "react";

import { useStep } from "./StepContext";
import { useSpinner } from "@/LoadingContext";

import {
    Button,
    Typography,
    Dialog,
    DialogBody,
    Stepper,
    Step,
} from "@material-tailwind/react";

import StepDate from "./StepDate";
import StepYear from "./StepYear";
import StepClubs from "./StepClubs";
import StepConfirm from "./StepConfirm";

export default function StepsDialog({ clubData, handleOpen, isDialogOpen }) {
    const {
        activeStep,
        setActiveStep,
        isLastStep,
        isFirstStep,
        setIsFirstStep,
        setIsLastStep,
        formData,
        resetSettings,
    } = useStep();

    const steps = [
        <StepDate />,
        <StepYear />,
        <StepClubs clubData={clubData} />,
        <StepConfirm />,
    ];

    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    const { showSpinner, setShowSpinner } = useSpinner();

    const handleClick = async () => {
        setShowSpinner(true); // Show spinner before making the request

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");
            const response = await fetch("/admin/booking-configs/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken, // Laravel-specific CSRF Token
                },
                body: JSON.stringify({
                    formData,
                }),
            });

            // Log the entire response object
            console.log("Response: ", response);

            if (!response.ok) {
                // Log the HTTP status code if something went wrong
                console.log(`Error, HTTP Status: ${response.status}`);
            } else {
                // If you want to log the response body, uncomment the following line:
                const responseBody = await response.text();
                console.log("Response Body: ", responseBody);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
            setShowSpinner(false); // Hide spinner whether the fetch was successful or not
        }
    };

    return (
        <Dialog open={isDialogOpen} handler={handleOpen} size="lg" className="">
            <div className="flex h-full flex-col justify-between min-w-screen-lg">
                <div className="h-full">
                    <Typography variant="h1" className="p-5">
                        Schedule New Booking Uptime
                    </Typography>

                    <DialogBody className="h-full p6 border-box overflow-auto min-w-[300px] flex-shrink-0">
                        {JSON.stringify(formData)}

                        <div className="w-full py-2 px-8 h-[80vh] flex flex-col justify-between min-w-[300px]">
                            <div>
                                <Stepper
                                    activeStep={activeStep}
                                    isLastStep={(value) => setIsLastStep(value)}
                                    isFirstStep={(value) =>
                                        setIsFirstStep(value)
                                    }
                                    className="mb-10"
                                >
                                    <Step onClick={() => setActiveStep(0)}>
                                        1
                                    </Step>
                                    <Step onClick={() => setActiveStep(1)}>
                                        2
                                    </Step>
                                    <Step onClick={() => setActiveStep(2)}>
                                        3
                                    </Step>
                                    <Step onClick={() => setActiveStep(2)}>
                                        4
                                    </Step>
                                </Stepper>
                                <div class="px-4 py-4">{steps[activeStep]}</div>
                            </div>
                            <div className=" flex justify-between">
                                <Button variant="text" onClick={resetSettings}>
                                    Reset
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handlePrev}
                                        disabled={isFirstStep}
                                        variant="outlined"
                                    >
                                        Prev
                                    </Button>
                                    <Button
                                        onClick={
                                            isLastStep
                                                ? handleClick
                                                : handleNext
                                        }
                                    >
                                        {isLastStep ? "Confirm" : "Next"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogBody>
                </div>
            </div>
        </Dialog>
    );
}
