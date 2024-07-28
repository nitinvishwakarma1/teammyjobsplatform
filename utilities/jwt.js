import jwt from 'jsonwebtoken';

export const tokenGenerator = (data, secretKey)=>{
    let token = '';
    if(data.role === 'admin'){
        token = jwt.sign({adminEmail: data.email}, secretKey, {expiresIn: '1d'});
    }else if(data.role === 'recruiter'){
        token = jwt.sign({recruiterEmail: data.email}, secretKey, {expiresIn: '1d'});
    }else{
        token = jwt.sign({candidateEmail: data.email}, secretKey, {expiresIn: '1d'});
    }
    return token;
}

export const tokenVerifier = (token, secretKey)=>{
    try {
        // console.log('token --> ',token);
        const payload = jwt.verify(token, secretKey);
        console.log("payload on token verifying ", payload);
        return payload;
      } catch (error) {
        console.log('Token verification failed:', error.message);
        // response.status(203).json({ message: "Token verification failed" });
        return error;
      }
}

