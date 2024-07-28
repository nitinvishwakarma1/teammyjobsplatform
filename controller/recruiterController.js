import randomstring from 'randomstring';
import vacancyModel from '../model/vacancyModel.js';
import recruiterModel from '../model/recruiterModel.js';

import { mailer } from '../utilities/mailer.js';
import { tokenGenerator, tokenVerifier } from '../utilities/jwt.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// import candidateModel from '../model/candidateModel.js';
var currentOTP = 0;
var currentData;
dotenv.config();

const RECRUITER_SECRETKEY = process.env.RECRUITER_SECRETKEY;

export const recruiterVerifyMailController = async (request, response) => {
    try {
        const { email, userName } = request.body;
        console.log('email ', request.body.email)
        console.log('userName ', request.body.userName)

        const existingUser = await recruiterModel.findOne({ email });

        if (existingUser) {
            response.status(409).json({ msg: 'Account already exist, try another email ..!' });
        } else {
            const otp = randomstring.generate({
                length: 4,
                charset: 'numeric',
            });
            console.log('otp -> ', otp);
            currentOTP = parseInt(otp);
            const msg = `Hello <b>${userName}</b><br>Welcome to Team-MyJobs-Platform, Your One Time Password is ${currentOTP} enter this otp and Verify Email<br>Thank You 😊`;
            mailer(email, msg, (info) => {
                if (info) {
                    console.log('otp sent sucesfully');
                    response.status(200).json({ message: 'Otp sent sucessfully' });
                }
                else {
                    response.status(404).json({ message: 'email not sent' });
                }
            });
        }


    } catch (error) {
        console.log(response.statusCode);
        console.log("Error in recruiterVerifyMailController ..!", error)
        response.status(response.statusCode).json({ msg: 'Error in recruiterVerifyMailController ..!' })

    }
}

export const recruiterVerifyOTPController = (request, response, next) => {
    try {
        console.log(request.query.otp);
        if (parseInt(request.query.otp) === currentOTP) {
            console.log('OTP verification successfull ..!');
            next();
        }
    } catch (error) {
        // response.status(response.statusCode).json({ msg: 'Error in userVerifyOTPController ..!' })
    }
}

export const recruiterRegisterationController = async (request, response) => {
    try {
        const data = request.body;
        console.log('Data to register : ', data);

        data.password = await bcrypt.hash(data.password, 10);
        console.log('Hashed Password --> ', data.password);

        const userData = await recruiterModel.create(data);
        console.log('userData ==> ', userData);

        const token = tokenGenerator(userData, RECRUITER_SECRETKEY);
        console.log('recruiterSecretKey ==> ', RECRUITER_SECRETKEY);
        console.log('token --> ', token);
        response.status(response.statusCode).json({ userData: userData, token: token, msg: 'You have been successfully registered ..!' })
    } catch (error) {
        console.log(error)
        response.status(response.statusCode).json({ msg: 'Error in recruiterRegisterationController ..!' })
    }
}

export const recruiterLoginController = async (request, response) => {
    try {
        const { email, password } = request.body;
        const userData = await recruiterModel.findOne({ email });
        if (!userData) {
            response.status(404).json({ msg: 'Account Not Found ..!' });
        } else {
            const isMatched = await bcrypt.compare(password, userData.password);
            console.log('Hello from recruiterLoginController ..!');
            console.log(isMatched);
            if (isMatched && userData.status === true) {
                console.log('Login Successfull ..!')
                console.log('Your Credentials are true, You can access now your dashboard ..!');
                const token = tokenGenerator(userData, RECRUITER_SECRETKEY);
                console.log('recruiterSecretKey ==> ', RECRUITER_SECRETKEY);
                console.log('token --> ', token);
                response.status(response.statusCode).json({ userData: userData, token: token, msg: 'Sign In Completed ..!' })
            } else {
                console.log('Wrong Email or Password ..!');
                throw new Error('Wrong Email or Password ..!');
            }
        }

    } catch (error) {
        if (error.message === 'Wrong Email or Password ..!') {
            response.status(401).json({ msg: error.message });
        } else {
            response.status(500).json({ msg: 'Error in userLoginController ..!' });
        }
    }
}

export const recruiterAuthenticationController = async (request, response) => {
    try {
        const token = request.body.recruiter_token;
        if (!token) {
            response.status(404).json({ message: "Token not found" });
        } else {
            const payload = await tokenVerifier(token, RECRUITER_SECRETKEY);
            // console.log('Payload --> ', payload);
            var result = await recruiterModel.findOne({ email: payload.recruiterEmail });
            // console.log('Authenntication Successfull ..!', result)
            response.status(200).json({ userData: result, token: token, msg: "Authenntication Successfull ..!" });
        }
    } catch (err) {
        console.log("Error while user authentication Controller", err);
        response.status(203).json({ message: 'Token Not verify please login then try to access ..!' });
    }
};

export const recruiterUpdateProfileController = async (request, response) => {
    try {
        let dataToUpdate = request.body;
        dataToUpdate.profileImg = request.file.originalname;
        // console.log('payload ',request.payload);
        // console.log('dataToUpdate : ', dataToUpdate);
        // console.log('profileImg : ', request.file.originalname);
        const email = dataToUpdate.email;
        const result = await recruiterModel.updateOne({ email: email }, { $set: dataToUpdate });
        console.log('result', result);
        response.status(200).json({ msg: "Data Updated Successfully  ..!", result });
    } catch (error) {
        console.log("In UpdatData ---> ", error);
        response.status(404).json({ msg: 'Data not found ..!' })
    }
};

export const recruiterDeleteProfileController = async (request, response) => {
    try {
        const email = request.payload.recruiterEmail;
        console.log('request.body', email)
        let data = await recruiterModel.findOne({ email });
        // console.log("Accout Data to delete : ", email);
        data.status = false;
        // console.log("Accout Data to delete : ", data);
        const result = await recruiterModel.updateOne({ email: email }, { $set: data })
        response.status(200).json({ msg: "Account has been successfully Deactivated ..!", result })
    } catch (error) {
        console.log("In UpdatData ---> ", error);
        response.status(404).json({ msg: 'Data not found ..!' })
    }
};

export const recruiterLogoutController = (request, response) => {
    // response.clearCookie('jwt_token');
    // response.render("recruiterLogin", { message: "Successfully Logout" });
};

// for backend 
export const recruiterAuthenticateJWT = (request, response, next) => {
    const token = request.query.recruiterToken;
    // console.log('recruiter token --> ',token);
    if (!token) {
        return response.status(401).json({ message: "Token not found" });
    }
    try {
        const payload = jwt.verify(token, RECRUITER_SECRETKEY);
        request.payload = payload;
        next();
    } catch (error) {
        return response.status(401).json({ message: "Invalid or expired token" });
    }
};
