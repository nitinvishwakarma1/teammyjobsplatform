import express from 'express';
const adminRouter = express.Router();
import { uploads } from '../utilities/multer.js';
import { adminAuthenticationController, adminGetRecruiterListController, adminLoginController, adminUpdateRecruiterStatusController } from '../controller/adminController.js';

adminRouter.get('/',(request, response)=>{
    console.log('Hello from adminRouter ..!');
})

adminRouter.post('/adminLogin', adminLoginController);
adminRouter.post("/adminAuthentication", adminAuthenticationController);
adminRouter.get('/adminRecruiterList', adminGetRecruiterListController);
adminRouter.get('/adminUpdateRecruiterStatus', adminUpdateRecruiterStatusController);

export default adminRouter;