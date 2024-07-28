import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.connection_STRING);
        // await mongoose.connect('mongodb://127.0.0.1:27017/myjobsdb')
        console.log('Database Connection Established ..!');
    }catch (error) {
        console.error('Error while connecting with Database ..!',error);
    }
}