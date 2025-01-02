import axios from 'axios';

export const SetAdmin = (values, handleUpper)=>{
    axios
    .post(`${process.env.REACT_APP_BACKEND_URL}/admin/email-password`, values)
    .then((res)=>{
        handleUpper(0);
    })
    .catch((err)=>{
        console.log(err);
    })
    
}