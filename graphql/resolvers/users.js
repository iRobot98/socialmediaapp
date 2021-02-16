const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const { getFields, populateObject, getValue } = require('./utils.js')
const { validateRegisterInput, validateLoginInput } = require('../../util/validators.js')
const { SECRET_KEY } = require('../../config.js')
const Users = require('../../models/user.js').UserModel

const generateToken = (user) => {
    let res = user
    return jwt.sign({
        id: res.id,
        email: res.email,
        username: res.username
    }, SECRET_KEY, { expiresIn: '1h' });
}

const printObject = (target) => {
    const keys = Object.getOwnPropertyNames(target)
    let result = ""
    let i = 0
    keys.forEach((item) => {
        if (typeof (item) == 'object') {
            printObject(item)
        } else {
            result += String(`${keys[i]}: ${item} \n`)
        }
        i++
    })
    return result
}

module.exports = {
    Query: {

    },
    Mutation: {
        async register(
            // root,message
            parrent,

            context, info
        ) {
            console.log('register called')
            // try {
            //     console.log(printObject(root))
            // console.log(printObject(message))
            // } catch (err) {
            //     console.log(err)
            // }
            
                const { username, email, password, confirmPassword } = context.registerInput
            
            //  Validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            // Make sure user doesn't already exist
            const user = await Users.findOne({ username })
            if (user) {
                throw new UserInputError('Username is taken', {
                    erros: {
                        username: 'This username is taken'
                    }
                })
            }

            // hash password and create an auth token
            const cryptPassword = await bcrypt.hash(password, 12);

            const newUser = new Users({
                username,
                password: cryptPassword,
                createdAt: new Date().toISOString(),
                email
            })

            const res = await newUser.save()

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token
            }
        },

        login: async (_, { username, password }) => {
            const { errors, valid } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            const user = await Users.findOne({ username })
            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors })
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', { errors })
            }

            const token = generateToken(user)

            return {
                ...user._doc,
                id: user._id,
                token
            }
        }
    }
}