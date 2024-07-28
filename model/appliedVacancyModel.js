import mongoose from "mongoose";

var appliedVacancySchema = mongoose.Schema({
    vid: {
        type: String,
        required: true
    },
    candidateEmail: {
        type: String,
        required: true
    },
    recruiterEmail: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Applied"
    }
}, { versionKey: false, timestamps: true });

export default mongoose.model('appliedVacancyModel', appliedVacancySchema, 'appliedVacancy');