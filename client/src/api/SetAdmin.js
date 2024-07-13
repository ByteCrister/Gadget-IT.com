import axios from 'axios';

export const SetAdmin = (values, handleUpper)=>{
    axios
    .post('http://localhost:7000/admin/email-password', values)
    .then((res)=>{
        handleUpper(0);
    })
    .catch((err)=>{
        console.log(err);
    })
    
}