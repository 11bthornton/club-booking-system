<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use League\Csv\Reader;
use App\Models\User; // Import your User model

class CsvFileValidation implements Rule
{
    protected $messages = [];
    protected $errorLine;

    public function passes($attribute, $value)
    {
        $validator = \Validator::make(
            ['file' => $value],
            ['file' => 'required|file|mimetypes:text/csv,application/csv,application/excel,application/vnd.ms-excel,application/vnd.msexcel']
        );

        if ($validator->fails()) {
            $this->messages[] = 'The uploaded file is not a valid CSV.';
            return false;
        }

        // Define the expected column headers, including optional ones
        $expectedHeaders = ['first_name', 'second_name', 'year', 'email', 'username', 'password'];

        // Read and validate the CSV file
        $csv = Reader::createFromPath($value->getPathname(), 'r');
        $csv->setHeaderOffset(0); // Assuming the first row contains headers

        $headers = $csv->getHeader();

        // Check if all required columns are present (excluding optional ones)
        if (count(array_diff($expectedHeaders, $headers)) > 0) {
            $this->messages[] = 'The following required columns are missing: ' . implode(', ', array_diff($expectedHeaders, $headers));
            return false;
        }

        $errors = [];

        // Check the "Year" column values
        foreach ($csv->getRecords() as $lineNumber => $record) {
            $year = (int)$record['year'];
            if (!in_array($year, [7, 8, 9, 10, 11])) {
                $this->errorLine = $lineNumber + 1; // Adjust line number (0-based index)
                $errors[] = 'Line ' . $this->errorLine . ': Invalid year value: ' . $year;
            }

            // Check the "Email" column for valid email addresses if it exists and is not empty
            if (array_key_exists('email', $record)) {
                $email = trim($record['email']);
                if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $this->errorLine = $lineNumber + 1; // Adjust line number (0-based index)
                    $errors[] = 'Line ' . $this->errorLine . ': Invalid email format: ' . $email;
                }

                // Check if a user with the same email already exists
                if (User::where('email', $email)->exists()) {
                    $this->errorLine = $lineNumber + 1; // Adjust line number (0-based index)
                    $errors[] = 'Line ' . $this->errorLine . ': User with the same email already exists: ' . $email;
                }
            }

            // Check the "Username" column for uniqueness if it exists and is not empty
            if (array_key_exists('username', $record)) {
                $username = trim($record['username']);
                if (!empty($username) && User::where('username', $username)->exists()) {
                    $this->errorLine = $lineNumber + 1; // Adjust line number (0-based index)
                    $errors[] = 'Line ' . $this->errorLine . ': User with the same username already exists: ' . $username;
                }
            }
        }

        if (!empty($errors)) {
            $this->messages = array_merge($this->messages, $errors);
            return false;
        }

        return true; // Passed all validations
    }

    public function message()
    {
        return $this->messages ?: ['The CSV file does not match the required format.'];
    }
}