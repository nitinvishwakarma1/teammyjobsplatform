import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true
    },
    profession: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false,
        default: "I am passionate about leveraging my expertise to create robust and scalable solutions. Proficient in both frontend and backend technologies, I excel in environments that require innovative problem-solving and a keen eye for detail."

    },
    resume: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'candidate',
    },
    status: {
        type: Boolean,
        default: true
    }
}, { versionKey: false, timestamps: true });

export default mongoose.model('candidate', candidateSchema, 'candidate');
