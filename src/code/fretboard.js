import { Type } from "./scale.js";
import { Note, Sign } from "./note.js";
import { allChords } from "./chord.js";

/***
 * Position
 * - String
 * - Note
 * - Fret
 */
export class Position {
  constructor(string, note, fret) {
    this.string = string > 0 || string < 7 ? string : null;
    this.note = note;
    this.fret = fret > 0 || fret < 24 ? fret : null;
  }

  setString(string) {
    this.string = string;
  }

  setNote(note) {
    this.note = note;
  }

  setFret(fret) {
    this.fret = fret;
  }

  getString() {
    return this.string;
  }

  getNote() {
    return this.note;
  }

  getFret() {
    return this.fret;
  }
}

export class Fretboard {
  static totalFrets = 24;
  constructor() {
    this.capo = 0;
    this.chords = [];
    this.openStringNotes = this.resetOpenStrings();
    this.positions = [];
  }

  getChords() {
    return this.chords.map((c) => c.getName());
  }

  getCapo() {
    return this.capo;
  }

  addCapo(position = 1) {
    if (position > Fretboard.totalFrets || position < 0) {
      return;
    }
    if (position === this.capo) {
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

  addPosition(position) {
    this.positions.push(position);
  }

  addChord(chord) {
    this.chords.push(chord);
  }

  removeChord(chord) {
    this.chords.pop(chord);
  }

  resetOpenStrings() {
    return {
      6: new Note("E"),
      5: new Note("A"),
      4: new Note("D"),
      3: new Note("G"),
      2: new Note("B"),
      1: new Note("E"),
    };
  }

  getOpenSpots(fret = 0, limit = Fretboard.totalFrets) {
    var openSpots = {};
    for (let i = 0; i < limit; i++) {
      var offset = fret + i;
      if (this.capo + offset > Fretboard.totalFrets) {
        break;
      }
      var availableNotes = this.getRelativeNotes(offset);
      var enharmonics = Object.values({ ...availableNotes }).map((n) =>
        n.enharmonic()
      );
      Object.entries(availableNotes).forEach(([string, note]) => {
        var noteName = note.getName();
        var newSpot = { capo: this.capo + offset, string: string };
        if (noteName in openSpots) {
          openSpots[noteName].push(newSpot);
        } else {
          openSpots[noteName] = [newSpot];
        }
      });
      Object.entries(enharmonics).forEach(([string, note]) => {
        var noteName = note.getName();
        var newSpot = { capo: this.capo + offset, string: string };
        if (noteName in openSpots) {
          openSpots[noteName].push(newSpot);
        } else {
          openSpots[noteName] = [newSpot];
        }
      });
    }
    return openSpots;
  }

  getRelativeNotes(fret = 0) {
    if (fret === 0) {
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
  console.log(" ======= Fretboard State ======= ");
  console.log("capo", board.capo);
  console.log(
    "chords",
    board.chords.map((c) => c.getName())
  );
  console.log(
    "chord notes",
    board.chords.map((c) => c.notes.map((n) => n.getName()))
  );
  console.log(
    "open string notes",
    Object.values(board.openStringNotes).map((n) => n.getName())
  );
  console.log(
    "relative notes",
    Object.values(board.getRelativeNotes(1)).map((n) => n.getName())
  );
  console.log("positions", board.positions);
  console.log(" ");
};

var board = new Fretboard();

board.addChord(
  allChords.filter(
    (c) =>
      c.root.getLetter() === "E" &&
      c.root.sign === Sign.NATURAL &&
      c.type === Type.MINOR
  )[0]
);
logBoardState(board);
