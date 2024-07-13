import axios from 'axios';

export const ForgotPassApi = async (values, handleLoginStates) => {
    // alert(JSON.stringify(values, null, 2));

    handleLoginStates({
        isButtonLoading: true,
        emailNotFound: false,
        emailSend: false
    });

    try {
        const response = await axios.post('http://localhost:7000/user/forgot/password', values);
        const data = response.data;

        console.log('Forgot pass message : ' + data.message);
        if (data.message === 'Email not found') {
            handleLoginStates({
                isButtonLoading: false,
                emailNotFound: true,
                emailSend: false
            });
        } else if (data.message === 'Email Send') {
            handleLoginStates({
                isButtonLoading: false,
                emailNotFound: false,
                emailSend: true
            });
        }
    } catch (error) {
        console.log(error);
        handleLoginStates({
            isButtonLoading: false,
            emailNotFound: true,
            emailSend: false
        });
    }
};
