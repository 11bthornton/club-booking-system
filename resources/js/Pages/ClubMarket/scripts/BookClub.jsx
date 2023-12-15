export default async function postClub(clubId, csrfToken, adminMode) {

    const route = adminMode.flag ? `/admin/book-for-student/${clubId}/student/${adminMode.id}` : `/club-market/${clubId}`;

    try {
        const response = await fetch(route, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": csrfToken,
            },
            
        });

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
    } finally {
        if(adminMode.flag) {
            // location.reload();
        }
    }
}
