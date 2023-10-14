export default async function findClubChanges(clubId, csrfToken) {

    try {
        const response = await fetch(`/simulate-book/${clubId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": csrfToken,
            },
        });

        // console.log(await response.text());
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            console.error(data.message);
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("There was an error:", error);
        throw error;
    }
}
