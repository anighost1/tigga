
const generateResponse = (res, status, message, data, extra = {}) => {
    res.status(status).json({
        message: message,
        data: data,
        ...extra
    })
}

export default generateResponse