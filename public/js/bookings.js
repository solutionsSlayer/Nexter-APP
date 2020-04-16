const axios = require('axios');
const Swal = require("sweetalert2");

export const deleteBook = async (homeId) => {
    try {
        await axios({
            method: 'DELETE',
            url: `http://127.0.0.1:3000/api/v1/bookings/${homeId}`
        }).then(
            setTimeout(() => {
                location.assign('/my-bookings');
            }, 1500)
        )
    } catch (err) {
        Swal.fire({
            title: 'Something wrong',
            text: err.response.data.message,
            icon: "error",
            confirmButtonText: "Confirm"
        });
    }
}