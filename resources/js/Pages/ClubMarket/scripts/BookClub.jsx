export default async function postClub(clubId, csrfToken) {


    console.log("CSRF TOKEN is", csrfToken);

    try {
        const response = await fetch(`/club-market`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(
                {
                    id: clubId
                }
            )
        });

        // console.log("response text", await response.text());
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            console.error(data.message); // Error messages, e.g., "No available slots for this club."
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("There was an error:", error);
        throw error;
    }
}
