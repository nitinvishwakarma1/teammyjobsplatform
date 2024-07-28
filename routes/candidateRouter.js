import express from 'express';
import { candidateVerifyOTPController, candidateVerifyMailController, candidateRegisterationController, candidateAuthenticationController, candidateLoginController, candidateUpdatePasswordController, candidateResetPasswordController, candidateSetNewPasswordController, candidateDisplayDataController, candidateUpdateProfileController, candidateDeleteProfileController, candidateGetJobListController, candidateApplyForVacancyController, candidateGetAppliedVacancies, candidateAuthenticateJWT, candidateWithdrawVacancyRequest, ExampleVerifyMailController, ExampleRegistrationController } from '../controller/candidateController.js';
import { exampleUpload, profileImgUpload, resumeUpload } from '../utilities/multer.js';
const candidateRouter = express.Router();
// candidateRouter.post('/verifyEmail',(request, response)=>{
//     console.log('candidateRouter started ..!',request.body.email)
// })

candidateRouter.post('/exampleRoute', ExampleVerifyMailController);
candidateRouter.post('/exampleRoute2',exampleUpload, ExampleRegistrationController);


candidateRouter.post('/verifyEmail', candidateVerifyMailController);
candidateRouter.post('/verifyOTP', candidateVerifyOTPController,resumeUpload,candidateRegisterationController);


// candidateRouter.post('/checkMail', candidateCheckMailController);
candidateRouter.post("/candidateAuthentication", candidateAuthenticationController);

candidateRouter.post('/candidateLogin', candidateLoginController);
candidateRouter.post('/resetPassword', candidateResetPasswordController);
candidateRouter.post('/resetPasswordByOTP', candidateVerifyOTPController, candidateSetNewPasswordController);


candidateRouter.use(candidateAuthenticateJWT);

candidateRouter.post('/candidateUpdateProfile', profileImgUpload, candidateUpdateProfileController);
candidateRouter.post('/candidateDeleteAccount', candidateDeleteProfileController);

candidateRouter.get('/getJobList', candidateGetJobListController);
candidateRouter.get('/candidateGetAppliedVacancies', candidateGetAppliedVacancies);
candidateRouter.get('/candidateWithdrawVacancyRequest', candidateWithdrawVacancyRequest);
candidateRouter.post('/candidateApplyForVacancy', candidateApplyForVacancyController);

candidateRouter.post('/updatePassword', candidateUpdatePasswordController);
candidateRouter.post('/displayData', candidateDisplayDataController);
candidateRouter.post('/deleteProfile', candidateDeleteProfileController);


// candidateRouter.post()
export default candidateRouter;

