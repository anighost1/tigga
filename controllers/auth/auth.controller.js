import User from "../../models/user.model.js"
import generateResponse from "../../lib/generateResponse.js"
import HttpStatus from "../../lib/httpStatus.js"

export const signup = async (req, res) => {
    const { name, username, email, password } = req.body
    try {
        const newUser = await User.signup(name, username, email, password)
        generateResponse(
            res,
            HttpStatus.OK,
            'User successfully created',
            newUser
        )
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, err)
        generateResponse(
            res,
            err?.status || HttpStatus.BadRequest,
            err?.message
        )
    }
}

export const login = async (req, res) => {
    const { identifier, password } = req.body
    try {
        const token = await User.login(identifier, password)
        generateResponse(
            res,
            HttpStatus.OK,
            'User logged in successfully',
            token
        )
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, err)
        generateResponse(
            res,
            err?.status || HttpStatus.BadRequest,
            err?.message
        )
    }
}
