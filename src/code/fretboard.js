import { Scale, Type } from "./scale.js";
import { Note, Sign, Direction } from "./note.js";
import { Chord, allChords } from "./chord.js";

export class Fretboard {
  constructor() {
    this.capo = 0;
    this.chords = [];
    this.openStringNotes = this.resetOpenStrings();
  }

  getChords() {
    return this.chords.map((c) => c.getName());
  }

  addCapo(position = 1) {
    if (position > 24 || position < 0) {
      return;
    }
    if (position == this.capo) {
      return;
    }

    if (position > this.capo) {
      this.transposeChords(position);
      this.transposeNotes(position);
      this.capo = position;
    } else {
      this.removeCapo();
      this.addCapo(position);
    }
  }

  transposeChords(newPosition = 1) {
    var intervals = Math.abs(this.capo - newPosition);
    while (intervals > 0) {
      this.chords.map((c) => c.transpose());
      intervals--;
    }
  }

  transposeNotes(newPosition = 1) {
    var intervals = Math.abs(this.capo - newPosition);
    while (intervals > 0) {
      Object.entries(this.openStringNotes).map(
        ([k, n]) => (this.openStringNotes[k] = n.halfStep())
      );
      intervals--;
    }
  }

  removeCapo() {
    this.chords.map((c) => c.reset());
    this.openStringNotes = this.resetOpenStrings();
    this.capo = 0;
  }

  addChord(chord) {
    this.chords.push(chord);
  }

  removeChord(chord) {
    this.chords.pop(chord);
  }

  resetOpenStrings() {
    return {
      1: new Note("E"),
      2: new Note("A"),
      3: new Note("D"),
      4: new Note("G"),
      5: new Note("B"),
      6: new Note("E"),
    };
  }

  getRelativeNotes(fret = 0) {
    if (fret == 0) {
      return this.openStringNotes;
    }
    var originalCapo = this.capo;
    this.addCapo(this.capo + fret);
    const result = { ...this.openStringNotes };
    this.addCapo(originalCapo);
    return result;
  }
}

const logBoardState = (board) => {
  console.log(" ===== Fretboard State ===== ");
  console.log("capo", board.capo);
  console.log(
    "chords",
    board.chords.map((c) => c.getName())
  );
  console.log(
    "open string notes",
    Object.values(board.openStringNotes).map((n) => n.getName())
  );
  console.log(
    "relative notes",
    Object.values(board.getRelativeNotes(1)).map((n) => n.getName())
  );
  console.log(" ");
};

var board = new Fretboard();
board.addChord(allChords[0]);
logBoardState(board);
