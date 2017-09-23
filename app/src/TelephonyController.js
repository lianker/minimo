import Call from './Call'
import CallManager from './CallManager'

export class TelephonyController{
    constructor(){
        let $ = document.querySelector.bind(document);      

        this._caller = $("#caller");
        this._called = $("#called");
        this._empresaId = $("#empresaId");
        this._leadId = $("#leadId");

        this._callManager = new CallManager(this._empresaId.value, this._leadId.value )
    }

    _startListener(){

    }

    initCall(){
        let call = new Call(this._caller.value, this._called.value, this._empresaId.value);
        
        this._callManager.initCall(call)
                            .then(data => console.log(`Controller says: ${data}`));
    }
    
    endCall(){

    }

    getCallStatus(){

    }
}