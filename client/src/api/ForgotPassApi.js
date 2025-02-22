import axios from 'axios';

export const ForgotPassApi = async (values, setDataState) => {

    setDataState((prev) => ({
        ...prev,
        isButtonLoading: true,
        emailNotFound: false,
        emailSend: false,
        error : false
    }));

    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/forgot/password`, values);
        const data = await response.data;

        console.log('Forgot pass message : ' + data.message);
        if (data.message === 'Email not found') {
            setDataState((prev) => ({
                ...prev,
                emailNotFound: true
            }));
        } else if (data.message === 'Email Send') {
            setDataState((prev) => ({
                ...prev,
                emailSend: true
            }))
        }
        setDataState((prev) => ({
            ...prev,
            isButtonLoading: false
        }));
    } catch (error) {
        console.log(error);
        setDataState((prev) => ({
            ...prev,
            isButtonLoading: false,
            error: true
        }));
    }
};
