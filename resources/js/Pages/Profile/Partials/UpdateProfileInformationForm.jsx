import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition, Listbox } from "@headlessui/react";
import { Select, Option } from "@material-tailwind/react";

import { useSpinner } from "@/LoadingContext";
import { useEffect } from "react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
    user,
}) {

    console.log(user);
    const { setShowSpinner } = useSpinner();

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            id: user.id,
            username: user.username,
            email: user.email,
            year: user.year,
            first_name: user.first_name,
            second_name: user.second_name
        });

    useEffect(() => {
        setShowSpinner(processing);
    }, [processing]);

    const submit = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    const yearOptions = [
        { value: "7", label: "Year 7" },
        { value: "8", label: "Year 8" },
        { value: "9", label: "Year 9" },
        { value: "10", label: "Year 10" },
        { value: "11", label: "Year 11" },
    ];

    return (
        <section className={className}>

            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update this student's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        className="mt-1 block w-full"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        required
                        isFocused
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.username} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        isFocused
                        autoComplete="email"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="first-name" value="First Name" />

                    <TextInput
                        id="first-name"
                        className="mt-1 block w-full"
                        value={data.first_name}
                        onChange={(e) => setData("first_name", e.target.value)}
                        required
                        isFocused
                        autoComplete="First name"
                    />

                    <InputError className="mt-2" message={errors.first_name} />
                </div>

                <div>
                    <InputLabel htmlFor="second-name" value="Second Name" />

                    <TextInput
                        id="second-name"
                        className="mt-1 block w-full"
                        value={data.second_name}
                        onChange={(e) => setData("second_name", e.target.value)}
                        required
                        isFocused
                        autoComplete="Second name"
                    />

                    <InputError className="mt-2" message={errors.second_name} />
                </div>

                <div>
                    {/* <InputLabel htmlFor="year-group" value="Year Group" /> */}

                    <Select
                        id="year"
                        name="year"
                        label="Year Group"
                        value={data.year}
                        onChange={(e) => setData("year", e)}
                        className="mt-1 mb-4"
                    >
                        {yearOptions.map((yearOption) => (
                            <Option key={yearOption.value} value={yearOption.value}>
                                {yearOption.label}
                            </Option>
                        ))}
                    </Select>

                    <InputError className="mt-2" message={errors.year} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
