import express from 'express';
import { recruiterVerifyMailController, recruiterVerifyOTPController, recruiterRegisterationController, recruiterLoginController, recruiterAuthenticationController, recruiterUpdateProfileController, recruiterDeleteProfileController, recruiterLogoutController, recruiterAuthenticateJWT } from '../controller/recruiterController.js';
const recruiterRouter = express.Router();
import { profileImgUpload, uploads } from '../utilities/multer.js';



recruiterRouter.post('/verifyEmail', recruiterVerifyMailController);
recruiterRouter.post('/verifyOTP', recruiterVerifyOTPController, recruiterRegisterationController);

recruiterRouter.post('/recruiterLogin', recruiterLoginController);
recruiterRouter.post('/recruiterAuthentication', recruiterAuthenticationController);

recruiterRouter.post('/recruiterUpdateProfile', profileImgUpload, recruiterAuthenticateJWT, recruiterUpdateProfileController);
recruiterRouter.get('/recruiterDeleteAccount', recruiterAuthenticateJWT, recruiterDeleteProfileController);

recruiterRouter.get("/recruiterLogout", recruiterAuthenticateJWT, recruiterLogoutController);

export default recruiterRouter;
