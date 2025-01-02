import axios from 'axios';

export const SignInPost = async (setDataState, values) => {
    setDataState((prev) => ({
        isButtonLoading: true,
        isEmailExist: false,
        isEmailSend: false,
        emailNotFound: false,
        error: false
    }));

    try {

        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/registration`, values);
        const data = response.data;
        console.log(data.message);

        if (data.message === 'Email already exists') {
            setDataState((prev) => ({
                ...prev,
                isEmailExist: true
            }));

        } else if (data.message === 'Email Confirmation Sent') {
            setDataState((prev) => ({
                ...prev,
                isEmailSend: true
            }));

        } else {
            setDataState((prev) => ({
                ...prev,
                emailNotFound: true
            }));

        }
        setDataState((prev) => ({
            ...prev,
            isButtonLoading: false
        }));

    } catch (error) {
        console.log(error);
        setDataState((prev) => ({
            ...prev,
            error: true,
            isButtonLoading: false
        }));
    }
}
