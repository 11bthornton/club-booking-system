import React, {
    createContext,
    useState,
    useContext,
    FunctionComponent,
} from "react";

import { Spinner } from "@material-tailwind/react";

// Create context
const SpinnerContext = createContext();

// Create Provider component
const SpinnerProvider = ({ children }) => {
    const [showSpinner, setShowSpinner] = useState(false);

    return (
        <SpinnerContext.Provider value={{ showSpinner, setShowSpinner }}>
            {showSpinner && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 100000000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Spinner
                        color="blue"
                        style={{ width: "50px", height: "50px" }}
                    />
                </div>
            )}
            {children}
        </SpinnerContext.Provider>
    );
};

// Custom hook to use the Spinner context
const useSpinner = () => {
    const context = useContext(SpinnerContext);
    if (!context) {
        throw new Error("useSpinner must be used within a SpinnerProvider");
    }
    return context;
};

export { SpinnerProvider, useSpinner };
