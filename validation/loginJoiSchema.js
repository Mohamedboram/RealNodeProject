import Joi from "joi"


const loginJoiSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
}) 


export default loginJoiSchema