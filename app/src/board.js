function createBoard(description, phases) {
  return {
    description: description,
    phases: phases
  };
}

function addPhase(board, phase) {
  board.phases.push(phase);
}
