import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

import { SpinnerProvider } from "./LoadingContext";
// import { AvailableClubsProvider } from "./ClubContext";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

// import { ThemeProvider } from '@material-tailwind/react';

// import { Inertia } from "@inertiajs/inertia";

// This will run globally for all Inertia responses
// Inertia.on("success", (event) => {
//   console.log("Event:", event.detail);

//   // If it exists, destructure the xhr object.
//   const { xhr } = event || {};

//   if (xhr) {
//     const newCsrfToken = xhr.getResponseHeader("X-CSRF-TOKEN");
//     if (newCsrfToken) {
//       document
//         .querySelector('meta[name="csrf-token"]')
//         .setAttribute("content", newCsrfToken);
//     }
//   } else {
//     console.warn("xhr object not found in the event");
//   }
// });

// Your createInertiaApp call or equivalent setup here

import { ThemeProvider } from "@material-tailwind/react";

createInertiaApp({
  title: (title) => `${title} - Bethany Club Booking`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.jsx`,
      import.meta.glob("./Pages/**/*.jsx"),
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
        <SpinnerProvider>
          <ThemeProvider>
            <ErrorBoundary>

              <App {...props} />
            </ErrorBoundary>

          </ThemeProvider>
        </SpinnerProvider>
    );
  },
  progress: {
    color: "#4B5563",
  },
});


import React from 'react';

import { Button, Typography } from "@material-tailwind/react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Prepare the data to be sent
    const errorData = {
      error_message: error.toString(),
      component_stack: errorInfo.componentStack,
      url: window.location.href,
      user_agent: navigator.userAgent,
    };

    // Send a POST request to the server
    axios.post('/report-error', errorData)
      .then(() => {
        // console.log("Successfully Submitted");
      })
      .catch(() => {
        // console.log("There was an error submitting the form");
      });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorDisplay />
      );
    }

    return this.props.children;
  }
}


function ErrorDisplay() {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <Typography variant="h2" className="mb-8 text-center text-red-500">
        Oops! Something went wrong.
      </Typography>
      <Typography variant="paragraph" className="mb-4 text-center">
        We're sorry for the inconvenience and we're working on it. Please try again later.
      </Typography>
      <Button
        color="lightBlue"
        buttonType="filled"
        size="regular"
        className="mt-4"
        ripple="light"
        onClick={() => window.location.href = '/dashboard'}
      >
        Return to Dashboard
      </Button>
    </div>
  );
}