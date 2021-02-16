function isEmail(email) {
    // var regex = /([0-9 ]+)/
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

module.exports = {
    validateRegisterInput:
        (username, email, password, confirmPassword) => {
            const errors = {}
            if (username.trim() === '') {
                errors.username = 'Username must not be empty';
            }
            if (email.trim() === '') {
                errors.email = 'Email must not be empty';
            } else if (!isEmail(email)) {
                errors.email = 'Email must be a valid email address';
            }
            if (password.trim() === '') {
                errors.password = 'Password must not be empty'
            } else if (password.length < 8) {
                errors.password = 'Password must be at least 8 Characters long';
            } else if (password !== confirmPassword) {
                errors.confirmPassword = 'Passwords must match';
            }

            const valid = Object.keys(errors).length < 1;
            return {
                errors,
                valid
            }
        },

    validateLoginInput: (username, password) => {
        const errors = {}
        if (username.trim() === '') {
            errors.username = 'Username must not be empty';
        }
        if (password.trim() === '') {
            errors.password = 'Password must not be empty'
        } else if (password.length < 8) {
            errors.password = 'Password must be at least 8 Characters long';
        }

        const valid = Object.keys(errors).length < 1;
        return {
            errors,
            valid
        }
    }
}