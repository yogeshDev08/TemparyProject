import CryptoJS from 'crypto-js';

export function getData() {
    let data = sessionStorage.getItem("dermatom-context-data");
    let decryptedData;

    if (data !== null) {
        let bytes = CryptoJS.AES.decrypt(data, 'dermatom-dsk');
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    }

    return null;
}