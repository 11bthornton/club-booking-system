import { useForm } from "@inertiajs/inertia-react";
import { Button } from "@material-tailwind/react";
export default function StudentImportForm() {

    const { data, setData, post, reset, errors } = useForm({
        file: null
    });

    // Function to handle file input change
    const handleFileInputChange = (e) => {
        const selectedFile = e.target.files[0]; // Get the selected file
        setData('file', selectedFile); // Update the 'file' field in the form data
    };

    // Function to reset the form and clear the selected file
    const handleReset = () => {
        reset(); // Reset the form data
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="p-4 sm:p-8 bg-white shadow-md sm:rounded-lg">
                <h2 className="text-lg font-medium text-gray-900">
                    Import Users
                </h2>

                {
                    JSON.stringify(errors)
                }
                <p className="mt-1 text-sm text-gray-600">
                    Upload a file with all the new users you wish to add. This should be an excel or csv file with the following headers.
                </p>
                <ul className="text-sm mt-3 ml-3">
                    <li>username</li>
                    <li>year</li>
                    <li>email *</li>
                    <li>first_name</li>
                    <li>last_name</li>
                </ul>

                <p className="mt-3 text-sm text-gray-600">
                    Users must be unique. Any duplicates already found in the system will cause the whole batch to fail and none will be uploaded.
                </p>

                {/* File input */}
                <input
                    type="file"
                    accept=".csv, .xlsx" // Specify accepted file types if needed
                    onChange={handleFileInputChange} // Call the function when the file input changes
                    style={{ display: "none" }} // Hide the input element
                />

                {/* Display the selected file */}
                <div className="bg-gray-50 p-3 mt-3">
                    {data.file && (
                        <p className="text-sm text-gray-600">
                            Selected File: {data.file.name}
                        </p>
                    )}

                    {/* Button to trigger file input click */}
                    <Button
                        className="mt-3 mr-2"
                        size="sm"
                        onClick={() => {
                            // Trigger the file input when this button is clicked
                            document.querySelector('input[type="file"]').click();
                        }}
                        variant="outlined"
                    >
                        Select File
                    </Button>
                </div>
                <br />
                {/* Reset button */}
                <div className="flex justify-between mt-1">

                    {/* Upload button */}
                    <Button
                        // variant="outlined"
                        className="mt-3"
                        onClick={() => {
                            post(route("admin.students.import"))
                        }}
                    >
                        Upload
                    </Button>
                    <Button
                        // variant="outlined"
                        variant="text"
                        color="red"
                        className="mt-3"
                        onClick={handleReset} // Call the reset function to clear the selected file
                    >
                        Reset
                    </Button>


                </div>
            </div>
        </div>
    );
}
