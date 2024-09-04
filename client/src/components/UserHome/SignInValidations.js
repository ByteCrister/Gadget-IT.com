import * as Yup from 'yup';

const emailDomainValidation = (email) => {
  const domain = email.split('@')[1];
  const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']; 
  return validDomains.includes(domain);
};

const validationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .matches(/^[A-Za-z\s]+$/, 'First Name must contain only letters and spaces')
    .min(3, 'First Name must be at least 3 characters')
    .max(50, 'First Name must be 50 characters or less')
    .required('First Name is required'),
  lastName: Yup.string()
    .trim()
    .matches(/^[A-Za-z\s]+$/, 'Last Name must contain only letters and spaces')
    .min(3, 'Last Name must be at least 3 characters')
    .max(50, 'Last Name must be 50 characters or less')
    .required('Last Name is required'),
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

export default validationSchema;
