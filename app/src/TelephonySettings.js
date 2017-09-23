import axios from 'axios'

export default class TelephonySettings {
    constructor(empresaClienteId, leadId) {
        this._key = `settings##${empresaClienteId}##${leadId}`;
    }

    getSettings(empresaClienteId, leadId) {
        return axios.get("http://localhost:8080/api/v2/telephony-settings")
            .then(res => {
                return res.data;
            })
            .catch(err => {
                throw new Error(err.message);
            })
    }

    _getFromLocalStorage() {
        return JSON.parse(localStorage.getItem(this._key))
    }

    _setToLocalStorage(telephonySettings) {
        localStorage.setItem(this._key, JSON.stringify(telephonySettings));
    }
}