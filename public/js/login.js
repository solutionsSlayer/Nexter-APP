const axios = require("axios");
const Swal = require("sweetalert2");

export {
    login
};

const login = async (email, password) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://127.0.0.1:3000/api/v1/users/login",
            data: {
                email,
                password
            }
        });

        if (res.data.status === "success") {
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        Swal.fire({
            title: 'Something wrong',
            text: err.response.data.message,
            icon: "error",
            confirmButtonText: "Confirm"
        });
    }
};