
import vacancyModel from '../model/vacancyModel.js';
import candidateModel from '../model/candidateModel.js';
import appliedVacancyModel from '../model/appliedVacancyModel.js';

export const recruiterAddVacancyController = async (request, response) => {
    try {
        const vacancyData = request.body;
        const { jobTitle, companyName, recruiterEmail, experienceLevel, jobLocation } = vacancyData;
        // console.log("Hello from recruiterAddVacancyController ", vacancyData, request.file,10);
        // console.log('request.payload : ',request.payload);
        vacancyData.companyLogo = request.file.originalname;
        const existingVacancy = await vacancyModel.findOne({
            jobTitle,
            companyName,
            recruiterEmail,
            experienceLevel,
            jobLocation
        });

        if (existingVacancy) {
            // console.log("existingVacancy")

            response.status(409).json({ msg: 'Same vacancy Already Exist, add another vacancy ..!' });
        } else {
            console.log("Unique Vacancy")
            const resultantVacancyData = await vacancyModel.create(vacancyData);
            console.log("vacancy created successfully ..!")
            if (resultantVacancyData) {
                console.log("vacancy id ..! ", resultantVacancyData._id);
                response.status(response.statusCode).json({ msg: 'Your Request for Adding vcanacy to the portal has been received ..!' });
            }
        }

    } catch (error) {
        console.log("Error in recruiterAddVacancyController ..! ", error)
        response.status(response.statusCode).json({ msg: 'Error in recruiterAddVacancyController ..!' })
    }
}

export const recruiterUpdateVacancyController = async (request, response) => {
    try {
        const _id = request.query._id;
        const updateData = {
            $set: request.body
        }
        // console.log('recruiterUpdateVacancyController :: ', _id, '   ', request.body);
        // console.log('request.payload : ',request.payload);

        var status = await vacancyModel.updateOne({ _id: _id }, updateData);
        console.log(status);
        response.status(200).json({ msg: 'Vacancy has been updated Successfully ..!' });
    } catch (error) {
        console.log("Error in recruiterAddVacancyController ..! ", error)
        response.status(response.statusCode).json({ msg: 'Error in recruiterAddVacancyController ..!' })
    }
}

export const recruiterDeleteVacancyController = async (request, response) => {
    try {
        var _id = request.query.vacancy_id;
        // console.log('request.query :: ', request.query);
        // console.log('request.payload : ',request.payload);
        var status = await vacancyModel.deleteOne({ _id: _id });
        console.log("Vacancy deleted sucessfully", status);
        response.status(200).json({ msg: 'Vacancy has been deleted successfully ..!' });

    } catch (error) {
        console.log("Error in recruiter delete vacancy Controller" + error);
        response.status(500).json({ message: "Error in recruiter delete vacancy Controller" });
    }
};

export const recruiterGetVacancyListController = async (request, response) => {
    try {
        const recruiterEmail = request.payload.recruiterEmail;
        console.log('recruiterEmail', recruiterEmail);
        const vacancyList = await vacancyModel.find({ recruiterEmail: recruiterEmail });
        // console.log("vacancies posted by me : -> ", vacancyList);
        if (!vacancyList) {
            response.status(404).json({ vacancyList: null, msg: "No Vacancy Found" });
        }
        response.status(200).json({ vacancyList: vacancyList, msg: "These are the applied vacancies by you" });
    } catch (error) {
        console.log('Error while retrieving vacancyList list ..!', error);
        response.status(500).json({ appliedVacancies: null, msg: "No Applied Vacancy Found" });
    }
};

export const recruiterGetApplicantListController = async (request, response) => {
    try {
        const recruiterEmail = request.payload.recruiterEmail;
        console.log('recruiterEmail', recruiterEmail);
        const appliedCandidateList = await appliedVacancyModel.find({ recruiterEmail: recruiterEmail });
        console.log("appliedCandidateList : -> ", appliedCandidateList);
        if (!appliedCandidateList) {
            response.status(404).json({ appliedCandidateList: null, msg: "No Vacancy Found" });
        } else {
            var candidateFile = [];
            for (let i = 0; i < appliedCandidateList.length; i++) {
                console.log(' appliedCandidateList[i].candidateEmail ', appliedCandidateList[i].candidateEmail);
                let filename = await candidateModel.findOne({ email: appliedCandidateList[i].candidateEmail });
                candidateFile.push(filename.resume);
            }
            // const applicantList = await candidateModel.find({ candidateEmail: appliedCandidateList.candidateEmail });
            // console.log('applicantList ', applicantList);
            console.log('candidateFile ', candidateFile);
            response.status(200).json({ appliedCandidateList: appliedCandidateList, candidateDocs: candidateFile, msg: "These are the applied vacancies by you" });
        }
    } catch (error) {
        console.log('Error while retrieving applicantList list ..!', error);
        response.status(500).json({ appliedVacancies: null, msg: "No Applied Vacancy Found" });
    }
}

export const recruiterUpdateCandidateStatusController = async (request, response) => {
    const vid = request.query._id;
    const action = request.query.action;
    // console.log("vid : ", vid);
    // console.log("action : ", action);
    // console.log('request.payload : ',request.payload);
    const status = (action === 'Shortlisted') ? 'Shortlisted' : 'Rejected';
    const updateStatus = { $set: { status: status } };
    const result = await appliedVacancyModel.updateOne({ vid: vid }, updateStatus);
    console.log("Status Updated : ", result);
    response.status(200).json({ msg: 'Candidate Status Updated Successfully !' });
};
