import * as Yup from 'yup';
const emailDomainValidation = (email) => {
    const domain = email.split('@')[1];
    const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    return validDomains.includes(domain);
};

const LoginValidations = Yup.object({
    email: Yup.string()
        .trim()
        .email('Invalid email format')
        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format')
        .test('is-valid-domain', 'Email domain is not valid', emailDomainValidation)
        .required('Email is required'),
    password: Yup.string()
        .trim()
        .min(6, 'Password must be at least 6 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
        .required('Password is required'),
});

export default LoginValidations;