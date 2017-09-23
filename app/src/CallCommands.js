export default class CallCommands {
  static initCall(caller, called, includeCommand = false) {
    let call = {
      "caller": caller,
      "called": called
    };

    if (includeCommand) {
      call.command = "CALL";
    }

    return JSON.stringify(call);
  }

  static getCallStatus(callId) {
    return JSON.stringify({
      "command": "CALL",
      "callId": callId
    });
  }

  static getCallSumary(callId) {
    return JSON.stringify({
      "command": "CALL_SUMARY",
      "callId": callId
    });
  }

  static endCall(callId, includeCommand = false) {
    let endCall = { "callId": callId };

    if (includeCommand) {
      endCall.command = "END_CALL";
    }

    return JSON.stringify(endCall);
  }
}
