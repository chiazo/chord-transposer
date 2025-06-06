import { Scale, Type } from "./scale.js";
import { Direction, Note, allNotes } from "./note.js";
export class Chord {
  constructor(root, type = Type.MAJOR) {
    this.originalRoot = root;
    this.root = root;
    this.type = type;
    this.scale = new Scale(root, type);
    this.notes = this.createChord();
  }

  createChord() {
    if ([Type.MAJOR, Type.MINOR].indexOf(this.type) >= 0) {
      return [this.scale.notes[0], this.scale.notes[2], this.scale.notes[4]];
    } else if ([Type.MAJOR_7, Type.MINOR_7].indexOf(this.type) >= 0) {
      return [
        this.scale.notes[0],
        this.scale.notes[2],
        this.scale.notes[4],
        this.scale.notes[6],
      ];
    } else if (this.type == Type.SUS_2) {
      return [this.scale.notes[0], this.scale.notes[1], this.scale.notes[4]];
    } else if (this.type == Type.SUS_4) {
      return [this.scale.notes[0], this.scale.notes[3], this.scale.notes[4]];
    } else if ([Type.MAJOR_9, Type.MINOR_9].indexOf(this.type) >= 0) {
      return [
        this.scale.notes[0],
        this.scale.notes[2],
        this.scale.notes[4],
        this.scale.notes[6],
        this.scale.notes[1],
      ];
    }
  }

  reset() {
    this.root = this.originalRoot;
    this.scale = new Scale(this.root, this.type);
    this.notes = this.createChord();
  }

  transpose(direction = Direction.UP, wholeStep = false) {
    this.notes = this.notes.map((n) =>
      wholeStep ? n.wholeStep(direction) : n.halfStep(direction)
    );
    this.root = this.notes[0];
    this.scale = new Scale(this.root, this.type);
  }

  getName() {
    return `${this.root.getName()} ${this.type}`;
  }

  enharmonic() {
    return this.notes.map((c) => c.enharmonic());
  }

  sameNotes(notes) {
    var sameNoteNames =
      notes.map((n) => n.getName()).toString() ==
      this.notes.map((n) => n.getName()).toString();
    var matchesEnharmonicsOneWay =
      notes.map((n) => n.enharmonic().getName()).toString() ==
      this.notes.map((n) => n.getName()).toString();

    var matchesEnharmonicsOtherWay =
      this.notes.map((n) => n.enharmonic().getName()).toString() ==
      notes.map((n) => n.getName()).toString();

    return (
      sameNoteNames || matchesEnharmonicsOneWay || matchesEnharmonicsOtherWay
    );
  }

  equals(chord) {
    if (!this.root.equals(chord.root)) {
      return false;
    }

    return this.sameNotes(chord.notes);
  }
}

var chords = Object.entries(Type).flatMap(([k, v]) =>
  allNotes.map((n) => new Chord(new Note(n.getLetter(), n.getSign()), v))
);

export const allChords = Array.from(
  new Map(chords.map((c) => [c.getName(), c])).values()
);
