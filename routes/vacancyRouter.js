import express from 'express';
const vacancyRouter = express.Router();
import { uploads } from '../utilities/multer.js';
import { recruiterAddVacancyController, recruiterUpdateVacancyController,recruiterDeleteVacancyController, recruiterGetVacancyListController,recruiterGetApplicantListController,recruiterUpdateCandidateStatusController } from '../controller/recruiterVacancyController.js';
import { recruiterAuthenticateJWT } from '../controller/recruiterController.js';

// vacancyRouter.get('/',(request, response)=>{
//     console.log('Hello from vacancyRouter ..!');
// });
vacancyRouter.use(recruiterAuthenticateJWT);

vacancyRouter.post('/recruiterAddVacancy', uploads, recruiterAddVacancyController);
vacancyRouter.put('/recruiterUpdateVacancy', uploads, recruiterUpdateVacancyController);
vacancyRouter.get('/recruiterDeleteVacancy', recruiterDeleteVacancyController);
vacancyRouter.get('/recruiterGetVacancyList', recruiterGetVacancyListController);
vacancyRouter.get('/recruiterGetApplicantList', recruiterGetApplicantListController);
vacancyRouter.get('/recruiterUpdateCandidateStatus', recruiterUpdateCandidateStatusController);


export default vacancyRouter;