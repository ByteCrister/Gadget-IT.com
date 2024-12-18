require('dotenv').config();

const crypto = require('crypto');

// *The encryption key
const encryptionKey = process.env.CRYPTO_SECRET_KEY;

// *Ensure the encryption key is exactly 32 bytes (256 bits) for aes-256-cbc
const key = Buffer.from(encryptionKey, 'utf8');

// *Pad or truncate the key to 32 bytes (256 bits)
const paddedKey = Buffer.alloc(32);  
key.copy(paddedKey);  
if (key.length < 32) {
    paddedKey.fill(0, key.length); 
}

// *The IV from the environment variables and convert it to a buffer
const ivHex = process.env.CRYPTO_IV;
const iv = Buffer.from(ivHex, 'hex');

module.exports = {
    //* Encrypting the bank source ID
    encryptBankSourceId: (sourceId) => {
        // *Creating the cipher instance using the padded key and IV
        const cipher = crypto.createCipheriv('aes-256-cbc', paddedKey, iv);
        let encrypted = cipher.update(sourceId, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    },

    //* Decrypting the bank source ID
    decryptBankSourceId: (encryptedData) => {
        // *Creating the decipher instance using the padded key and IV
        const decipher = crypto.createDecipheriv('aes-256-cbc', paddedKey, iv);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
};