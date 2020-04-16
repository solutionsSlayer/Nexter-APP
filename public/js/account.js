const axios = require('axios');
const Swal = require("sweetalert2");

export {
    update,
    updatePwd
};

const update = async (data) => {
    try {
        await axios({
            method: 'PUT',
            url: 'http://127.0.0.1:3000/api/v1/users/update-me',
            data
        })
    } catch (err) {
        Swal.fire({
            title: 'Something wrong',
            text: err.response.data.message,
            icon: "error",
            confirmButtonText: "Confirm"
        });
    }
}

const updatePwd = async (passwordCurr, password, passwordConfirm) => {
    try {
        await axios({
            method: 'PUT',
            url: 'http://127.0.0.1:3000/api/v1/users/update-password',
            data: {
                passwordCurr,
                password,
                passwordConfirm
            }
        })
    } catch (err) {
        Swal.fire({
            title: 'Something wrong',
            text: err.response.data.message,
            icon: "error",
            confirmButtonText: "Confirm"
        });
    }

}