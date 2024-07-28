const db = require('./DB');

module.exports = {

    userEmailExistModel : (email, callback)=>{
            db.query('SELECT email FROM user WHERE email = ?', [email], callback);
    },

    newUserEntryModel : (body, callback)=>{
        const { first_name, last_name, email, password } = body;
        console.log('from newUserEntryModel - '+body);

        const insertUserQuery = 'INSERT INTO user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
        db.query(insertUserQuery,[first_name, last_name, email, password], callback)
    },

    adminPassMatch : (callback)=>{
        db.query('select admin_password from admin where admin_no = 1', callback);
    },
    adminEmailMatch : (email, callback)=>{
        db.query('select admin_email from admin where admin_email = ? ',[email], callback);

    },

    userEmailMatchOrNotModel : (email, callback)=>{
        db.query('select email from user where email = ? ', [email], callback);
    },

    userPassMatchModal : (email, callback)=>{
        db.query('select * from user where email = ?', [email], callback);
    },

    userNewPasswordModel : (email, password, callback)=>{
        db.query('update user set password = ? where email = ? ', [password, email], callback);
    },

    setNewAdminPasswordEmailModel : (email, password, callback)=>{
        console.log('from admin model '+email+' pass - '+password);
        db.query('update admin set admin_email = ?, admin_password = ? where admin_no = 1', [email, password], callback);
        // db.query('INSERT INTO admin (admin_email, admin_password) VALUES (?, ?)', [email, password], callback);
    }
}