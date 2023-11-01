import React, { useState, useEffect } from 'react';
import { format, differenceInSeconds } from 'date-fns';
import { utcToZonedTime, format as formatTz } from 'date-fns-tz';

const CountdownTimer = ({ targetDate, className }) => {
  // Parse the target date from the prop in the "YYYY-MM-DD HH:mm:ss" format
  const londonTimeZone = 'Europe/London';
  const targetDateTime = new Date(targetDate);
  const targetDateTimeLondon = utcToZonedTime(targetDateTime, londonTimeZone);

  // Initialize state for countdown values
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Function to update the countdown
  const updateCountdown = () => {
    const currentDateTime = new Date();
    const currentDateTimeLondon = utcToZonedTime(currentDateTime, londonTimeZone);

    const secondsDifference = differenceInSeconds(targetDateTimeLondon, currentDateTimeLondon);

    if (secondsDifference <= 0) {
      // The countdown has expired
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    } else {
      // Calculate the remaining days, hours, minutes, and seconds
      const days = Math.floor(secondsDifference / (60 * 60 * 24));
      const hours = Math.floor((secondsDifference % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((secondsDifference % (60 * 60)) / 60);
      const seconds = secondsDifference % 60;

      // Update the state with the countdown values
      setCountdown({ days, hours, minutes, seconds });
    }
  };

  // Update the countdown every second
  useEffect(() => {
    const intervalId = setInterval(updateCountdown, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
      `${countdown.days} days ${countdown.hours} hours ${countdown.minutes} minutes ${countdown.seconds} seconds`
  );
};

export default CountdownTimer;
