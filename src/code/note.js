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
    if (sign == Sign.NATURAL) return true;
    if (sign == Sign.FLAT) return ["C", "F"].indexOf(letter) == -1;
    return ["B", "E"].indexOf(letter) == -1;
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

  getEnharmonic() {
    if (this.sign == Sign.NATURAL) {
      return this;
    }

    if (this.sign == Sign.SHARP && ["B", "E"].indexOf(this.letter) >= 0) {
      return this;
    }

    if (this.sign == Sign.FLAT && ["C", "F"].indexOf(this.letter) >= 0) {
      return this;
    }

    var letterIdx = Note.notes.indexOf(this.letter);
    var offset = this.sign == Sign.FLAT ? letterIdx - 1 : letterIdx + 1;
    var enharmIdx =
      offset >= Note.notes.length
        ? 0
        : offset < 0
        ? Note.notes.length - 1
        : offset;
    var enharmSign = letterIdx > offset ? Sign.SHARP : Sign.FLAT;

    return new Note(Note.notes[enharmIdx], enharmSign);
  }

  halfStep(direction) {
    return this.#nextNote(this, direction);
  }

  wholeStep(direction) {
    var halfStep = this.#nextNote(this, direction);
    return this.#nextNote(halfStep, direction);
  }

  equals(note) {
    return this.isValidNote(note.letter, note.sign) && ((note.letter == this.getLetter() && note.sign == this.getSign()) || (note.getEnharmonic().getLetter() == this.getLetter() && note.getEnharmonic().sign == this.getSign()));
  }

  #nextNote(note, direction) {
    var letterIdx = Note.notes.indexOf(note.letter);
    var offset = direction == Direction.UP ? letterIdx + 1 : letterIdx - 1;
    var exemptNotes =
      (["B", "E"].indexOf(note.letter) >= 0 && direction == Direction.UP) ||
      (["C", "F"].indexOf(note.letter) >= 0 && direction == Direction.DOWN);
    var nextNoteIdx =
      note.sign == Sign.NATURAL && !exemptNotes
        ? letterIdx
        : offset >= Note.notes.length
        ? 0
        : offset < 0
        ? Note.notes.length - 1
        : offset;

    if (note.sign == Sign.SHARP && direction == Direction.DOWN) {
      return new Note(Note.notes[letterIdx], Sign.NATURAL);
    }

    if (note.sign == Sign.NATURAL && !exemptNotes) {
      var nextNoteSign = direction == Direction.UP ? Sign.SHARP : Sign.FLAT;
    }

    var newSign = nextNoteSign || Sign.NATURAL;

    return new Note(Note.notes[nextNoteIdx], newSign);
  }
}

let letters = ["A", "B", "C", "D", "E", "F", "G"];

export const notes = letters
  .map((l) => new Note(l, Sign.NATURAL))
  .concat(
    letters.map((l) => new Note(l, Sign.FLAT)).filter((n) => n.getLetter() !== null)
  )
  .concat(
    letters.map((l) => new Note(l, Sign.SHARP)).filter((n) => n.getLetter() !== null)
  );
