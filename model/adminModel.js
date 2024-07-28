import mongoose from "mongoose";


var adminSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        default:'admin'
    },
    status: {
        type: Boolean,
        default: true
    }
}, { versionKey: false });

export default mongoose.model('adminModel', adminSchema, 'admin');