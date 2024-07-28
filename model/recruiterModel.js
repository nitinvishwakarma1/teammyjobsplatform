import mongoose from 'mongoose';

const recruiterSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    companyType: {
        type: String,
        required: true,
        enum: ['Private Limited (Pvt. Ltd.)', 'Service-Based', 'Product-Based', 'Startup']
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: false,
    },
    bio: {
        type: String,
        required: false,
        default: "Experienced HR Recruiter skilled in sourcing top talent and enhancing workforce quality through strategic hiring."
    },
    profession: {
        type: String,
        required: false,
    },
    profileImg: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'recruiter'
    },
    status: {
        type: Boolean,
        default: true
    }

}, { versionKey: false });

export default mongoose.model('recruiter', recruiterSchema, 'recruiter');