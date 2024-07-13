import axios from 'axios';

export const SignInPost = async (handlesignInStates, dataState, values ) => {
    handlesignInStates(true, dataState.isEmailExist, dataState.isEmailSend, dataState.emailNotFound);
    
    try {

        const response = await axios.post('http://localhost:7000/user/registration', values);
        const data = response.data;
        console.log(data.message);

        if (data.message === 'Email already exists') {
            handlesignInStates(false, true, false, false);

        } else if (data.message === 'Email Confirmation Send') {
            handlesignInStates(false, false, true, false);

        } else {
            handlesignInStates(false, false, false, true);
        }

    } catch (error) {
        console.log(error);
        handlesignInStates(false, true, false);
    }



}
