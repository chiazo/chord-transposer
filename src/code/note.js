export const Sign = {
  SHARP: "SHARP",
  FLAT: "FLAT",
  NATURAL: "NATURAL",
};

export const Direction = {
  UP: "UP",
  DOWN: "DOWN",
};

export class Note {
  static notes = ["A", "B", "C", "D", "E", "F", "G"];
  letter;
  sign;

  constructor(letter, sign = Sign.NATURAL) {
    var isValid = this.isValidNote(letter, sign);
    this.letter = isValid ? letter : null;
    this.sign = isValid ? sign : null;
  }

  isValidNote(letter, sign) {
    if (sign === Sign.NATURAL) return true;
    if (sign === Sign.FLAT) return !["C", "F"].includes(letter);
    return !["B", "E"].includes(letter);
  }

  setLetter(letter) {
    this.letter = letter;
  }

  getLetter() {
    return this.letter;
  }

  getSign() {
    return this.sign;
  }

  getName() {
    return this.sign !== Sign.NATURAL
      ? `${this.getLetter()} ${this.getSign()}`
      : `${this.getLetter()}`;
  }

  enharmonic() {
    if (this.sign === Sign.NATURAL) {
      return this;
    }

    if (this.sign === Sign.SHARP && ["B", "E"].includes(this.letter)) {
      return this;
    }

    if (this.sign === Sign.FLAT && ["C", "F"].includes(this.letter)) {
      return this;
    }

    var letterIdx = Note.notes.indexOf(this.letter);
    var offset = this.sign === Sign.FLAT ? letterIdx - 1 : letterIdx + 1;
    var enharmIdx =
      offset >= Note.notes.length
        ? 0
        : offset < 0
        ? Note.notes.length - 1
        : offset;
    var enharmSign = letterIdx > offset ? Sign.SHARP : Sign.FLAT;

    return new Note(Note.notes[enharmIdx], enharmSign);
  }

  halfStep(direction = Direction.UP) {
    return this.nextNote(direction);
  }

  wholeStep(direction = Direction.UP) {
    var halfStep = this.nextNote(direction);
    return halfStep.nextNote(direction);
  }

  minorThird(direction = Direction.UP) {
    var halfStepOne = this.halfStep(direction);
    var halfStepTwo = halfStepOne.halfStep(direction);
    return halfStepTwo.nextNote(direction);
  }

  equals(note) {
    return (
      this.isValidNote(note.letter, note.sign) &&
      ((note.letter === this.getLetter() && note.sign === this.getSign()) ||
        (note.enharmonic().getLetter() === this.getLetter() &&
          note.enharmonic().sign === this.getSign()))
    );
  }

  nextNote(direction = Direction.UP) {
    var letterIdx = Note.notes.indexOf(this.letter);
    var offset = direction === Direction.UP ? letterIdx + 1 : letterIdx - 1;
    var exemptNotes =
      (["B", "E"].includes(this.letter) && direction === Direction.UP) ||
      (["C", "F"].includes(this.letter) && direction === Direction.DOWN);
    var nextNoteIdx =
      this.sign === Sign.NATURAL && !exemptNotes
        ? letterIdx
        : offset >= Note.notes.length
        ? 0
        : offset < 0
        ? Note.notes.length - 1
        : offset;

    if (
      (this.sign === Sign.SHARP && direction === Direction.DOWN) ||
      (this.sign === Sign.FLAT && direction === Direction.UP)
    ) {
      return new Note(Note.notes[letterIdx], Sign.NATURAL);
    }

    if (this.sign === Sign.NATURAL && !exemptNotes) {
      var nextNoteSign = direction === Direction.UP ? Sign.SHARP : Sign.FLAT;
    }

    var newSign = nextNoteSign || Sign.NATURAL;

    return new Note(Note.notes[nextNoteIdx], newSign);
  }
}

let letters = ["A", "B", "C", "D", "E", "F", "G"];

export const allNotes = letters
  .map((l) => new Note(l, Sign.NATURAL))
  .concat(
    letters
      .map((l) => new Note(l, Sign.FLAT))
      .filter((n) => n.getLetter() !== null)
  )
  .concat(
    letters
      .map((l) => new Note(l, Sign.SHARP))
      .filter((n) => n.getLetter() !== null)
  );
