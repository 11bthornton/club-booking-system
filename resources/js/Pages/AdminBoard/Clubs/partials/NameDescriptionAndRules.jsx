import TextInput from "@/Components/TextInput";

import { useState } from "react";

import { Alert, Checkbox, Input, Textarea } from "@material-tailwind/react";

export default function NameDescriptionAndRules({ data, setData, errors }) {



    return (
        <div className="bg-white mt-4 p-6 rounded-lg shadow-sm">

            <div>

                <p className="mt-1 mb-3 text-sm text-gray-600">
                    <em><strong>Required</strong></em>: Provide a name for this club.
                </p>
                <TextInput
                    id="name"
                    className="w-2/5 mb-4"
                    placeholder="Club Name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    aria-required />
                {
                    errors.name &&
                    <Alert className="mb-4" color="red" variant="ghost">
                        {errors.name}
                    </Alert>
                }
            </div>
            <p className="mt-1 mb-3 text-sm text-gray-600">
                <em><strong>Required</strong></em>: Provide a textual description for this club.
            </p>
            <div>
                <Textarea
                    id="description"
                    label="Club Description"
                    className="w-2/5 mb-4"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    aria-required />
                {errors.description &&
                    <Alert className="mb-4" color="red" variant="ghost">
                        {errors.description}
                    </Alert>}
                <p className="mt-1 mb-3 text-sm text-gray-600">
                    <em><strong>Required</strong></em>: Describe any special rules about this club.
                </p>
            </div>
            <div>
                <Textarea
                    id="rule"
                    label="Rule Description"
                    className="w-2/5 mb-4"
                    value={data.rule}
                    onChange={(e) => setData("rule", e.target.value)} />
            </div>
            {errors.rule &&
                <Alert className="mb-4" color="red" variant="ghost">
                    {errors.rule}
                </Alert>}


            <p className="text-sm text-gray-600">
                <em><strong>Required</strong></em>: Is <strong>payment</strong> required for this club?
            </p>

            <div className="flex gap-20 items-center">
                <div className="w-32">
                    <Input
                        type="number"
                        value={data.is_paid ? data.is_paid : 0}
                        onChange={(e) => setData("is_paid", e.target.value)}
                    />

                </div>
                pounds
            </div>

            <div className="flex items-center gap-4">
            Per Session:
            <Checkbox
                // color={data.is_paid ? "green" : ""}
                checked={data.payment_type == "Per Session"}
                disabled={data.payment_type == "Per Session"}
                onChange={() => { setData("payment_type", "Per Session"); }} />
            </div>

            <div className="flex items-center gap-4">
            One off payment:
            <Checkbox
                // color={data.is_paid ? "green" : ""}
                checked={data.payment_type == "One Off"}
                disabled={data.payment_type == "One Off"}
                onChange={() => { setData("payment_type", "One Off"); }} />
            </div>

            <p className="mt-4 mb-3 text-sm text-gray-600">
                <em><strong>Required</strong></em>: Configure a ruleset. <br />

            </p>
            <div className="p-4 rounded-lg bg-gray-50">
                {errors.max_per_year &&
                    <Alert color="red" variant="ghost">
                        Max per year must be greater or equal to max per term.
                    </Alert>}
                <p className="text-sm text-gray-600">
                    How many times can a student pick this club per <strong>term</strong>?

                </p>
                <div className="flex w-full items-center gap-40">

                    <div className="w-32 mt-2">
                        <Input
                            id="max-per-term"
                            name="max-per-term"
                            disabled={data.max_per_term == null}

                            type="number"
                            placeholder={data.max_per_year == null ? "Unlimited" : ""}

                            value={data.max_per_term}
                            onChange={(e) => setData("max_per_term", e.target.value ? Number(e.target.value) : null)} />
                    </div>
                    <div className="flex items-center mt-2">
                        <em>Or unlimited</em>
                        <Checkbox
                            checked={data.max_per_term == null}
                            onChange={() => {
                                if (data.max_per_term == null) {
                                    setData("max_per_term", 1);
                                } else {
                                    setData("max_per_term", null);
                                }
                            }}
                        />
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                    How many times can a student pick this club per <strong>year</strong>?

                </p>
                <div className="flex w-full items-center gap-40">
                    <div className="w-32 mt-2">
                        <Input
                            id="max-per-year"
                            name="max-per-year"

                            type="number"
                            disabled={data.max_per_year == null}

                            placeholder={data.max_per_year == null ? "Unlimited" : ""}
                            value={data.max_per_year}
                            onChange={(e) => setData("max_per_year", e.target.value ? Number(e.target.value) : null)} />
                    </div>
                    <div className="flex items-center mt-2">
                        <em>Or unlimited</em>
                        <Checkbox
                            checked={data.max_per_year == null}
                            onChange={() => {
                                if (data.max_per_year == null) {
                                    setData("max_per_year", 1);
                                } else {
                                    setData("max_per_year", null);
                                }
                            }}
                        />
                    </div>
                </div>
                <p className="text-sm text-red-600 mt-4 font-bold">
                    Do the students have to do all of the below clubs? (Overrides max per year and max per term settings).
                    If students must commit to all days/terms, you must select this option otherwise students will be allowed to pick and choose their commitment to this club.
                </p>
                <Checkbox
                    label="Yes"
                    checked={data.must_do_all}
                    onChange={() => {
                        setData("must_do_all", !data.must_do_all);
                        // setData("max_per_term", null);
                        // setData("max_per_year", null);
                    }}
                >

                </Checkbox>
            </div>
        </div>
    )
}