export default async function deleteClub(clubId, csrfToken, adminMode) {

    const route = adminMode.flag ? `/admin/delete-for-student/${clubId}/student/${adminMode.id}` : `/club/${clubId}`;

    try {
        const response = await fetch(route, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": csrfToken,
            },
        });

        const data = await response.json();

        // Check the response status
        if (response.ok) {
            // console.log(data); // Successfully booked the club.
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("There was an error:", error);
        throw error;
    }
}
