<?php

namespace App\Imports;

use App\Models\User;
use Hash;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Database\QueryException; // Import QueryException
use Maatwebsite\Excel\Concerns\WithValidation;

use Illuminate\Validation\Rule;

class UsersImport implements ToCollection, WithHeadingRow, WithValidation
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */

    public function collection(Collection $rows)
    {
        /**
         * This is automatically wrapped within a DB transaction
         * so any duplicate students or errors in the file will cause
         * the whole batch to fail.
         */
        foreach ($rows as $row) {
            $user = new User();

            // Convert the Collection to an array using toArray()
            $attributes = $row->toArray();

            // Fill the User model with attributes
            $user->fill($attributes);
            $user->second_name = $attributes['last_name'];

            // Hash the password
            $user->password = Hash::make($attributes['password']);

            /**
             * Admins cannot be imported,
             * even if there is a mistake in the file and this heading is included,
             * set it to 0 anyway
             */
            $user->role = 0;

            try {
                $user->save();
            } catch (QueryException $e) {
                // Handle the exception (e.g., duplicate entry error)

                // Check if it's a duplicate entry error (unique constraint violation)
                if ($e->errorInfo[1] === 1062) {
                    // Redirect back with an error message
                    return redirect()->back()->with('error', 'Duplicate entry found in the file.');
                }

                // Handle other types of database errors as needed

                // You can log the error for debugging purposes
                \Log::error($e);

                // Optionally, you can rethrow the exception to propagate it further
                // throw $e;
            }
        }

        // Continue with the import process if no errors occurred
        // ...

        // Redirect or return a response as needed

        
    }

    public function rules(): array
    {
        return [
            'username' => [
                'required',
                'unique:users,username', // Unique username within the 'users' table
            ],
            // 'last_name' => 'required',
            // 'email' => ['unique:users,email'],
            'password' => 'required|min:6', // Example: Password must be at least 6 characters long
            // Add more rules for other columns as needed
        ];
    }

}
