export default class Board {
  constructor(description = "") {
    this.description = description;
    this._phases = [];
  }

  addPhase(phase) {
    this._phases.push({ index: this._phases.length, phase: phase });
  }
}
