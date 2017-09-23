import "babel-polyfill";
import { parseSecondsToHours } from "@common/utils/string/string";
import { INTERNAL_SERVER_ERROR } from "@common/utils/constants/httpStatusCodes";
import axios from "axios";
import TelephonyService from "./TelephonyService";
import Commands from "./CallCommands";
import Call from "./Call";
import * as CallState from "./CallState";

export default class PhoneDialer {
  constructor() {
    this.resource = "calls";
    this.telephonyService = new TelephonyService();
    this.providerSettings = null;
    this.managedCall = null;
    this.telephoneProviderAxios = null;
    this.isFinished = false;
    this.listener = null;
  }

  async makeCall(call, callbackFromView) {
    try {
      await this.getProviderSetings(call.empresaClienteId);

      this.managedCall = Call.generateFrom(call);
      this.updateManagedCall(CallState.SENT, callbackFromView);

      await this.isReadyToCall();

      await this.initCall(callbackFromView);

      this.telephonyService.saveCallData(this.managedCall);
      await this.manageCallState(callbackFromView);
    } catch (error) {
      throw error;
    }
  }

  async initCall(callbackFromView) {
    // `${this.providerSettings.provedorUrl}/${this.resource}/`
    try {
      const result = await this.telephoneProviderAxios.post(
        this.providerSettings.provedorUrl,
        Commands.generateInitCall(this.managedCall.caller, this.managedCall.called)
      );

      this.managedCall.callId = result.data.callId;
      this.updateManagedCall(CallState.RECEIVED, callbackFromView);
    } catch (error) {
      this.updateManagedCall(CallState.FAILED, callbackFromView);
      throw new Error(`Erro ao iniciar uma chamada`);
    }
  }

  async isReadyToCall() {
    if (this.providerSettings.prePago) {
      return true;
    }

    return true;
  }

  async manageCallState(callbackFromView) {
    // `${this.providerSettings.provedorUrl}/${this.resource}/${this.managedCall.callId}`
    await this.telephoneProviderAxios
      .get(this.providerSettings.provedorUrl)
      .then(res => {
        if (res.data.state === CallState.FINISHED || res.data.state === CallState.FAILED) {
          this.stopListener();
          this.updateManagedCall(CallState.FINISHED, callbackFromView);
        } else if (res.data.state === CallState.ESTABLISHED) {
          const storedCall = this.getFromLocalStorage(this.providerSettings.provedorNome);
          if (storedCall) {
            this.managedCall.talkingDurationSeconds = res.data.talkingDurationSeconds;
            this.startListener(this.manageCallState, this, callbackFromView);
            this.updateManagedCall(CallState.ESTABLISHED, callbackFromView);
          }
        } else {
          this.startListener(this.manageCallState, this, callbackFromView);
          this.updateManagedCall(res.data.state, callbackFromView);
        }
      })
      .catch(error => {
        this.stopListener();

        if (error.response.status >= INTERNAL_SERVER_ERROR) {
          this.updateManagedCall(CallState.FAILED, callbackFromView);
          throw new Error("Houve um erro no provedor de telefonia");
        }

        this.updateManagedCall(CallState.FAILED, callbackFromView);
        throw new Error(error.response.data.message);
      });
  }

  async callIsRunning(empresaClienteId) {
    try {
      await this.getProviderSetings(empresaClienteId);
      return !!this.getFromLocalStorage(this.providerSettings.provedorNome);
    } catch (error) {
      return false;
    }
  }
  stopListener() {
    clearTimeout(this.listener);
    this.listener = null;
  }

  startListener(fun, context, paramas) {
    this.stopListener();
    this.listener = setTimeout(fun.bind(context), 2000, paramas);
  }

  updateManagedCall(state, callbackFromView) {
    this.managedCall.changeStateTo(state);

    if (state === CallState.FINISHED || state === CallState.FAILED) {
      localStorage.removeItem(this.providerSettings.provedorNome);
    } else {
      localStorage.setItem(this.providerSettings.provedorNome, JSON.stringify(this.managedCall));
    }

    if (callbackFromView && typeof callbackFromView === typeof Function) {
      callbackFromView(this.managedCall);
    }
  }

  getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  endCall() {
    return new Promise((resolve, reject) => {
      this.telephoneProviderAxios
        .post(this.providerSettings.provedorUrl, Commands.endCall(this.managedCall.callId))
        .then(() => {
          this.isFinished = true;
          this.stopListener();
          this.updateManagedCall(CallState.FINISHED);
          resolve(this.managedCall);
        })
        .catch(() => {
          reject("Houve um erro ao encerrar a ligação");
        });
    });
  }

  async getProviderSetings(empresaClienteId) {
    if (!this.providerSettings) {
      await this.telephonyService
        .getSettings(empresaClienteId)
        .then(res => {
          this.providerSettings = res.data;

          this.telephoneProviderAxios = axios.create({
            withCredentials: false,
            headers: {
              "Content-Type": "application/json",
              token_auth: res.data.token_auth,
            },
            responseType: "json",
          });
        })
        .catch(() => {
          throw new Error("Erro ao buscar configurações de Telefonia");
        });
    }
  }
}

(() => {
  window.Call = Call;
  window.PhoneDialer = PhoneDialer;
  window.parseSecondsToHours = parseSecondsToHours;
})();
