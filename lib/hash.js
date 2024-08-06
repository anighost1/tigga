import bcrypt from 'bcrypt'

const hash = async (data) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(data, salt);
}

export default hash