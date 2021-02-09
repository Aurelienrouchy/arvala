import CryptoJS from 'crypto-js';
 
export const encrypt = (text: string) => CryptoJS.AES.encrypt(text, process.env.REACT_APP_SECRET_KEY || "").toString();

export const decrypt = (text: string) => CryptoJS.AES.decrypt(text, process.env.REACT_APP_SECRET_KEY || "").toString(CryptoJS.enc.Utf8);
