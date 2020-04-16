const axios = require("axios");
const Swal = require("sweetalert2");

export {
    logout
};

const logout = async () => {
    try {
        const res = await axios({
            method: "GET",
            url: "/api/v1/users/logout"
        });

        if (res.data.status === "success") {
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