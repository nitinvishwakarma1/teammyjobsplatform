import mongoose from 'mongoose';

var vacancySchema = mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobCategory: {
        type: String,
        required: true
    },
    jobPostingDate: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    jobLocation: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    companyName: {
        type: String,
        default: true
    },
    companyLogo: {
        type: String,
        required: true
    },
    minSalary: {
        type: String,
        required: true
    },
    maxSalary: {
        type: String,
        required: true
    },
    requiredSkillSets: {
        type: [String],
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    employmentType: {
        type: String,
        required: true
    },
    workdays: {
        type: String,
        required: true
    },
    numberOfVacancy: {
        type: String,
        required: true
    },
    recruiterEmail: {
        type: String,
        required: true
    },
    vacancyStatus: {
        type: String,
        default: "now hiring"
    },
    adminVerified: {
        type: Boolean,
        default: true
    }

}, { versionKey: false });

export default mongoose.model('vacancyModel', vacancySchema, 'vacancy');