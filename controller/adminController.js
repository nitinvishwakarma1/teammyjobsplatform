import adminModel from "../model/adminModel.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { tokenGenerator, tokenVerifier } from "../utilities/jwt.js";
import recruiterModel from "../model/recruiterModel.js";

dotenv.config();
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

export const adminLoginController = async (request, response) => {
    try {
        console.log('Hello from adminController ..!');
        const { email, password } = request.body;
        const adminData = await adminModel.findOne({_id:email});
        console.log('Admin credentials are ',request.body);

        if (!adminData) {
            response.status(404).json({ msg: 'Account Not Found ..!' });
        } else {
            var adminPassword = adminData.password;
            var status = await bcrypt.compare(password, adminPassword);
            if (status) {
                console.log('Login Successfull ..!')
                console.log('Your Credentials are true, You can access now your dashboard ..!',adminData);
                let data = {
                    email: adminData._id,
                    password: adminData.password,
                    role: adminData.role,
                    status: adminData.status
                }
                const token = tokenGenerator(data, ADMIN_SECRET_KEY);
                // console.log('Token----> ',token);
                response.status(200).json({ userData: adminData, adminEmail: email, token: token });
            } else {
                response.status(500).json({ message: "Error while Login" });
            }
        }

    } catch (error) {
        response.status(500).json({ msg: 'Error in adminLoginController ..!' });
    }
}

export const adminAuthenticationController = async (request, response) => {
    try {
        const token = request.body.admin_token;
        if (!token) {
            response.status(404).json({ message: "Token not found" });
        } else {
            const payload = await tokenVerifier(token, ADMIN_SECRET_KEY);
            // console.log('Payload --> ', payload);
            var result = await adminModel.findOne({ _id: payload.adminEmail });
            console.log('Authenntication Successfull ..!', result)
            response.status(200).json({ userData: result, token: token, msg: "Authenntication Successfull ..!" });
        }
    } catch (err) {
        console.log("Error while user authentication Controller", err);
        response.status(203).json({ message: 'Token Not verify please login then try to access ..!' });
    }
};

export const adminGetRecruiterListController = async (request, response) => {
    try {
        console.log('Hello from getRecruiterList ..!');
        const recruiterList = await recruiterModel.find();
        console.log('adminGetRecruiterListController :: ',recruiterList)
        response.status(200).json({ recruiterList: recruiterList, msg: "These are the existing recruiters ..!" })
    } catch (error) {
        console.log('Error while retrieving job list ..!', error);
        response.status(response.statusCode).json({ jobList: null, msg: "Error while retrieving job list ..!" })
    }
}

export const adminUpdateRecruiterStatusController = async (request, response) => {
    const recruiterEmail = request.query.recruiterEmail;
    const action = request.query.action;
    console.log("recruiterEmail : ", recruiterEmail);
    console.log("action : ", action);
    const status = (action === 'Activate') ? true : false;
    const updateStatus = { $set: { status: status } };
    const result = await recruiterModel.updateOne({ email: recruiterEmail }, updateStatus);
    // console.log("Status Updated : ");
    response.status(200).json({ msg: 'Candidate Status Updated Successfully !' });
};

