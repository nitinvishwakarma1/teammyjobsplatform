import express from 'express';
const appliedVacancyRouter = express.Router();
import { uploads } from '../utilities/multer.js';

appliedVacancyRouter.get('/',(request, response)=>{
    console.log('Hello from appliedVacancyRouter ..!');
})

export default appliedVacancyRouter;