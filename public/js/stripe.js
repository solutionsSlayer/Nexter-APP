import axios from 'axios';
const Swal = require("sweetalert2");
const stripe = Stripe('pk_test_zmn5CFzDD3IuM2pZZE1o5vnm00PiJ8usup');

export const getBook = async (homeId) => {
    try {
        const session = await axios(`/api/v1/bookings/checkout-session/${homeId}`);

        stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
        // console.log(session);
    } catch (err) {
        console.log(err);
        Swal.fire({
            title: 'Something wrong',
            text: err.response.data.message,
            icon: "error",
            confirmButtonText: "Confirm"
        });
    }
}