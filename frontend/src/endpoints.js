const BASE_URL = "http://localhost:8080/";

export const ENDPOINTS = {
    FETCH_FILES: `${BASE_URL}files/all`,
    TOGGLE_PUBLIC: (fileId) => `${BASE_URL}files/${fileId}/toggle-public`,
    DOWNLOAD_FILE: (file) => `${BASE_URL}files/download/${file}`,
    DELETE_FILE: (fileId) => `${BASE_URL}files/${fileId}`,
    GET_FILE: (fileId) => `${BASE_URL}files/public/${fileId}`,
    GET_CREDITS: `${BASE_URL}users/credits`,
    UPLOAD_FILE: `${BASE_URL}files/upload`,
    CREATE_ORDER: `${BASE_URL}payments/create-order`,
    VERIFY_PAYMENT: `${BASE_URL}payments/verify-payment`,
    TRANSACTIONS: `${BASE_URL}transactions`
}
