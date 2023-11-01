import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import DeleteUserForm from "@/Pages/AdminBoard/Students/Partials/DeleteUserForm";
import UpdateProfileInformationForm from "@/Pages/Profile/Partials/UpdateProfileInformationForm";
import AdminUpdatePasswordForm from "./Partials/AdminUpdatePasswordForm";

import UpdateClubInformationForm from "./UpdateClubInformationForm";

import { Head } from "@inertiajs/react";
import { useSpinner } from "@/LoadingContext";

export default function Edit({
    auth,
    mustVerifyEmail,
    status,
    student,
    availableClubs,
    organizedByTerm,
    csrf
}) {

    const { setShowSpinner } = useSpinner();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Editing User - {student.username}
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                            user={student}
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <AdminUpdatePasswordForm 
                            className="max-w-xl" 
                            user={student}
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateClubInformationForm
                            student={student}
                            availableClubs={availableClubs}
                            organizedByTerm={organizedByTerm}
                            csrf={csrf}
                        />
                    </div>

                    

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" user={student}/>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
