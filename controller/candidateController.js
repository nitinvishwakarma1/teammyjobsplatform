import randomstring from 'randomstring';
import candidateModel from '../model/candidateModel.js';
import vacancyModel from '../model/vacancyModel.js';
import appliedVacancyModel from '../model/appliedVacancyModel.js';
import { mailer } from '../utilities/mailer.js';
import { tokenGenerator, tokenVerifier } from '../utilities/jwt.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

var currentOTP = 0;
var currentData;
dotenv.config();
const CANDIDATE_SECRET_KEY = process.env.CANDIDATE_SECRET_KEY;

export const candidateVerifyMailController = async (request, response) => {
    try {
        console.log('body ', request.body)
        console.log('email ', request.body.email)
        console.log('userName ', request.body.userName)
        const email = request.body.email;
        const userName = request.body.userName;
        const existingUser = await candidateModel.findOne({ email });
        console.log(existingUser);

        if (existingUser) {
            response.status(409).json({ msg: 'Account already exist, try another email ..!' });
        } else {
            const otp = randomstring.generate({
                length: 4,
                charset: 'numeric',
            });
            console.log('otp -> ', otp);
            currentOTP = parseInt(otp);
            const msg = `Hello <b>${userName}</b><br>Email verification for your Team MyJobs Account creation, Your One Time Password is ${currentOTP} enter this otp and Verify Email<br>Thank You 😊`;

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
        console.log("Error in userVerifyMailController ..!", error)
        response.status(response.statusCode).json({ msg: 'Error in userVerifyMailController ..!' })
    }
};

export const candidateVerifyOTPController = (request, response, next) => {
    try {
        console.log(request.query.otp);
        if (parseInt(request.query.otp) === currentOTP) {
            console.log('OTP verification successfull ..!');
            next();
        }
    } catch (error) {
        response.status(500).json({ msg: 'Error in userVerifyOTPController ..!' })
    }
}

export const candidateRegisterationController = async (request, response) => {
    try {
        // console.log('candidateRegisterationController request.query.otp :',request.query);
        // console.log('candidateRegisterationController request.body :',request.body);
        // console.log('candidateRegisterationController request.file :',request.file.originalname);
        const data = request.body;
        // console.log('Data to register : ', currentData);

        data.password = await bcrypt.hash(data.password, 10);
        // console.log('Hashed Password --> ', data.password);
        data.resume = request.file.originalname;

        const userData = await candidateModel.create(data);
        console.log('userData registered successfully ==> ', userData);

        const token = tokenGenerator(userData, CANDIDATE_SECRET_KEY);
        // console.log('userSecretKey ==> ', CANDIDATE_SECRET_KEY);
        // console.log('token --> ', token);
        response.status(200).json({ userData: userData, token: token, msg: 'You have been successfully registered ..!' })
    } catch (error) {
        console.log(error)
        response.status(response.statusCode).json({ msg: 'Error in userRegisterationController ..!' })
    }
}

export const candidateLoginController = async (request, response) => {
    try {
        const { email, password } = request.body;
        const userData = await candidateModel.findOne({ email });
        if (!userData) {
            response.status(404).json({ msg: 'Account Not Found ..!' });
        } else {
            const isMatched = await bcrypt.compare(password, userData.password);
            console.log('Hello from userLoginController ..!');
            console.log(isMatched);
            if (isMatched && userData.status === true) {
                console.log('Login Successfull ..!')
                console.log('Your Credentials are true, You can access now your dashboard ..!');
                const token = tokenGenerator(userData, CANDIDATE_SECRET_KEY);
                console.log('userSecretKey ==> ', CANDIDATE_SECRET_KEY);
                console.log('token --> ', token);
                response.status(200).json({ userData: userData, token: token, msg: 'Sign In Completed ..!' })
            } else if (isMatched && !userData.status) {
                console.log('Account has been Deactivated ..!');
                throw new Error('Account has been Deactivated ..!');
            } else {
                console.log('Wrong Email or Password ..!');
                throw new Error('Wrong Email or Password ..!');
            }
        }

    } catch (error) {
        if (error.message === 'Wrong Email or Password ..!') {
            response.status(401).json({ msg: error.message });
        } else if (error.message === 'Account has been Deactivated ..!') {
            response.status(401).json({ msg: error.message });
        } else {
            response.status(500).json({ msg: 'Error in userLoginController ..!' });
        }
    }
}

export const candidateAuthenticationController = async (request, response) => {
    try {
        const token = request.body.candidate_token;
        if (!token) {
            response.status(404).json({ message: "Token not found" });
        } else {
            const payload = await tokenVerifier(token, CANDIDATE_SECRET_KEY);
            // console.log('Payload --> ', payload);
            var result = await candidateModel.findOne({ email: payload.candidateEmail });
            // console.log('Authenntication Successfull ..!', result)
            response.status(200).json({ userData: result, token: token, msg: "Authenntication Successfull ..!" });
        }
    } catch (err) {
        console.log("Error while user authentication Controller", err);
        response.status(203).json({ message: 'Token Not verify please login then try to access ..!' });
    }
};

export const candidateUpdatePasswordController = async (request, response) => {
    try {
        const { email, oldPassword, newPassword } = request.body;
        const userData = await candidateModel.findOne({ email });
        const isMatched = await bcrypt.compare(oldPassword, userData.password);
        if (isMatched) {
            userData.password = await bcrypt.hash(newPassword, 10);
            const result = await candidateModel.updateOne({ email: email }, { $set: userData });
            console.log('Password Updated Successfully ..!', result);
            response.status(response.statusCode).json({ msg: 'Your Password has been successfully Updated ..!' })

        } else {
            console.log('Password Not Matched ..!');
            throw new Error('Wrong Email or Password ..!');
        }
    } catch (error) {
        if (error.message === 'Wrong Email or Password ..!') {
            response.status(401).json({ msg: error.message });
        } else {
            response.status(500).json({ msg: 'Error in userUpdatePasswordController ..!' });
        }
    }
}

export const candidateResetPasswordController = async (request, response) => {
    try {
        const email = request.body.email;
        const userData = await candidateModel.findOne({ email });
        if (userData) {
            const otp = randomstring.generate({
                length: 4,
                charset: 'numeric',
            });
            console.log('otp -> ', otp);
            currentOTP = parseInt(otp);
            currentData = request.body;
            const msg = `Enter the OTP ${currentOTP} to get back to your Account ..!`
            const result = mailer(email, msg);
            console.log(result)
            if (result) {
                response.status(response.statusCode).json({ msg: 'OTP sent to registered email address ..!' })
            }

        } else {
            console.log('Account Not Found ..!');
            throw new Error('Account not found, Enter registerd email address ..!');
        }
    } catch (error) {
        if (error.message === 'Account not found, Enter registerd email address ..!') {
            response.status(404).json({ msg: error.message });
        } else {
            response.status(500).json({ msg: 'Error in resetPasswordController ..!' });
        }
    }
}

export const candidateSetNewPasswordController = async (request, response) => {
    try {
        const { email, newPassword } = request.body;
        const userData = await candidateModel.findOne({ email });
        userData.password = await bcrypt.hash(newPassword, 10);
        const result = await candidateModel.updateOne({ email: email }, { $set: userData });
        console.log('Password Updated Successfully ..!', result);
        response.status(response.statusCode).json({ msg: 'Your Password has been successfully Updated ..!' })
    } catch (error) {
        response.status(response.statusCode).json({ msg: 'Error in userSetNewPasswordController ..!' });
    }
}

export const candidateDisplayDataController = async (request, response) => {
    try {
        const email = request.body.email;
        const data = await candidateModel.findOne({ email: email });
        console.log("Found data : ", data);
        if (data.status) {
            response.status(201).json({ userData: data, msg: "This is your dersired data ..!" })
        } else {
            response.status(404).json({ userData: null, msg: "The Account You are Trying to Acces has been Deactivated ..!" })
        }
    } catch (error) {
        response.status(404).json({ msg: 'Data not found ..!' })
    }
}

export const candidateUpdateProfileController = async (request, response) => {
    try {
        let dataToUpdate = request.body;
        dataToUpdate.profileImg = request.file.originalname;
        // console.log('dataToUpdate : ', dataToUpdate);
        // console.log('profileImg : ', request.file.originalname);
        // console.log('request.payload : ',request.payload);
        const email = dataToUpdate.email;
        const result = await candidateModel.updateOne({ email: email }, { $set: dataToUpdate })
        console.log('result', result);
        response.status(200).json({ msg: "Data Updated Successfully  ..!", result });
    } catch (error) {
        console.log("In UpdatData ---> ", error);
        response.status(404).json({ msg: 'Data not found ..!' })
    }
};

export const candidateDeleteProfileController = async (request, response) => {
    try {
        const email = request.payload.candidateEmail;
        // console.log('request.body',request.body.email)
        // console.log('request.payload : ',request.payload);
        let data = await candidateModel.findOne({ email });
        // console.log("Accout Data to delete : ", data);
        data.status = false;
        // console.log("Accout Data status check : ", data);
        const result = await candidateModel.updateOne({ email: email }, { $set: data })
        response.status(200).json({ msg: "Account has been successfully Deactivated ..!", result })
    } catch (error) {
        console.log("In UpdatData ---> ", error);
        response.status(404).json({ msg: 'Data not found ..!' })
    }
};

export const candidateGetJobListController = async (request, response) => {
    try {
        const jobList = await vacancyModel.find();
        // console.log('Job List : ', jobList);
        // console.log('request.payload : ',request.payload);
        response.status(200).json({ jobList: jobList, msg: "These are the available jobs ..!" })

    } catch (error) {
        console.log('Error while retrieving job list ..!', error);
        response.status(response.statusCode).json({ jobList: null, msg: "Error while retrieving job list ..!" })
    }
}

export const candidateApplyForVacancyController = async (request, response) => {
    let vacancyObj = request.body;
    console.log('request.body ', request.body);
    console.log('candidateEmail ', vacancyObj.candidateEmail);
    console.log('recruiterEmail ', vacancyObj.recruiterEmail);
    let vid = vacancyObj._id;
    let candidateEmail = vacancyObj.candidateEmail;
    let recruiterEmail = vacancyObj.recruiterEmail;
    let jobTitle = vacancyObj.jobTitle;

    let obj = { vid, candidateEmail, recruiterEmail, jobTitle };
    try {
        var check = {
            $and: [
                { vid: vid },
                { candidateEmail: candidateEmail }
            ]
        };
        var status = await appliedVacancyModel.findOne(check);
        // console.log("Applied status : ", status);
        if (!status) {
            var appliedObj = await appliedVacancyModel.create(obj);
            console.log("appliedObj : ", appliedObj.vid);
            console.log("Applied for Vacancy Successfully");
            var appliedVacancies = await appliedVacancyModel.find({ candidateEmail: candidateEmail });
            response.status(200).json({ result: appliedObj, appliedVacancies: appliedVacancies, msg: "Applied for Vacancy" });

        } else {
            response.status(500).json({ msg: 'Something went wrong ..!' })

        }
    } catch (error) {
        console.log('Error while retrieving job list ..!', error);
        response.status(500).json({ jobList: null, msg: "Error while retrieving job list ..!" })
    }
}

export const candidateGetAppliedVacancies = async (request, response) => {
    try {
        const candidateEmail = request.payload.candidateEmail;
        // console.log('candidateEmail', candidateEmail);
        var appliedVacancyList = await appliedVacancyModel.find({ candidateEmail: candidateEmail });
        // console.log("appliedVacancies : -> ", appliedVacancies);
        if (!appliedVacancyList) {
            response.status(404).json({ appliedVacancies: null, msg: "No Applied Vacancy Found" });
        } else {
            const vacancyIds = appliedVacancyList.map(vacancy => new mongoose.Types.ObjectId(vacancy.vid)); 4
            let vacancies = await vacancyModel.find({ _id: { $in: vacancyIds } });
            // console.log('Applied Vacancy Details : ', vacancies);
            for (let i = 0; i < appliedVacancyList.length; i++) {
                // console.log('appliedVacancyList > vacancy.vid ',appliedVacancyList[i].vid);
                // console.log('appliedVacancies > vacancies.vid ',vacancies[i]._id.toString());
                for (let j = 0; j < appliedVacancyList.length; j++) {
                    if (appliedVacancyList[i].vid === vacancies[j]._id.toString()) {
                        vacancies[j] = {
                            ...vacancies[j].toObject(),
                            candidateStatus: appliedVacancyList[i].status
                        };
                        break;
                    }
                }
                console.log('-vacancies[i].candidateStatus -', vacancies[i].candidateStatus);
                // console.log('vacancyId ',vacancies[i]);
            }
            console.log('vacancies ', vacancies);


            response.status(200).json({ appliedVacancies: vacancies, msg: "These are the applied vacancies by you" });
        }
    } catch (error) {
        console.log('Error while retrieving job list ..!', error);
        response.status(500).json({ appliedVacancies: null, msg: "No Applied Vacancy Found" });
    }
}

export const candidateWithdrawVacancyRequest = async (request, response) => {
    try {
        const vacancy_id = request.query._id;
        // console.log('candidateEmail', candidateEmail);
        const result = await appliedVacancyModel.deleteOne({ vid: vacancy_id });
        console.log("candidateWithdrawVacancyRequest : -> ", result);
        if (result) {
            const vacancies = await vacancyModel.find({ _id: vacancy_id });
            console.log("remaining applied vacancies : -> ", vacancies);
            response.status(200).json({ appliedVacancies: vacancies, msg: "These are the applied vacancies by you" });
        }
    } catch (error) {
        console.log('Error while retrieving job list ..!', error);
        response.status(500).json({ appliedVacancies: null, msg: "No Applied Vacancy Found" });
    }
}


export const candidateLogoutController = (request, response) => {
    // response.render("candidateLogin",{message:"Successfully Logout"});
};

// for backend authentication
export const candidateAuthenticateJWT = (request, response, next) => {
    const token = request.query.candidateToken;
    // console.log('candidate token --> ',token);
    if (!token) {
        return response.status(401).json({ message: "Token not found" });
    }
    try {
        const payload = jwt.verify(token, CANDIDATE_SECRET_KEY);
        request.payload = payload;
        next();
    } catch (error) {
        return response.status(500).json({ message: "Invalid or expired Candidate token" });
    }
};


// example

export const ExampleRouteController = (request, response) => {
    try {
        console.log('ExampleRouteController body : ', request.body.email);
        response.status(200).json({ msg: 'success' });
    } catch (error) {
        console.log('Error in ExampleRouteController : ', error);
    }
}

export const ExampleVerifyMailController = (request, response) => {
    try {
        console.log('ExampleVerifyMailController body : ', request.body.email);
        // console.log('attachment in ExampleVerifyMailController : ',request.file);
        
        response.status(200).json({ otp:4040, msg: 'success' });
    } catch (error) {
        console.log('Error in ExampleRouteController : ', error);
    }
}

export const ExampleRegistrationController = (request, response) => {
    try {
        console.log('😁😁😁');
        console.log('ExampleRouteController body : ', request.body.email);
        console.log('attachment in ExampleVerifyMailController : ',request.file);

        response.status(200).json({ msg: 'success' });
    } catch (error) {
        console.log('Error in ExampleRouteController : ', error);
    }
}


