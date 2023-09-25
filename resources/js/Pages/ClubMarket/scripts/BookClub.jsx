export default async function postClub(clubId) {

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    console.log(csrfToken);

    try {
        const response = await fetch(`/club/${clubId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrfToken
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
        console.error('There was an error:', error);
        throw error;
    }
}