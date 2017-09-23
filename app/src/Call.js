export default class Call {
  constructor(caller, called, empresaClienteId, leadId, callId, talkingDurationSeconds = 0) {
    this.callId = callId;
    this.empresaClienteId = empresaClienteId;
    this.leadId = leadId;
    this.caller = caller;
    this.called = called;
    this.state = null;
    this.talkingDurationSeconds = talkingDurationSeconds;
  }

  clone() {
    return new Call(this.called, this.called, this.empresaClienteId, this.callId, this.talkingDurationSeconds);
  }

  static generateFrom(callParams) {
    return new Call(
      callParams.caller,
      callParams.called,
      callParams.empresaClienteId,
      callParams.leadId,
      callParams.callId,
      callParams.talkingDurationSeconds
    );
  }

  changeStateTo(state) {
    this.state = state;
  }
}
