const axios = require("axios");
const Swal = require("sweetalert2");

export {
    signup
};

const signup = async (name, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://127.0.0.1:3000/api/v1/users/sign-up",
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        });

        if (res.data.status === "success") {
            Swal.fire({
                title: "Bienvenue",
                text: "Profitez désormais des résidences de luce NEXTER!",
                icon: "success",
                confirmButtonText: "Cool"
            });

            setTimeout(() => {
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