import { Scale, Type } from "./scale.js";
import { Direction, Note, allNotes } from "./note.js";
export class Chord {
  constructor(root, type = Type.MAJOR) {
    this.root = typeof root == "string" ? new Note(root) : root;
    this.originalRoot = this.root;
    this.type = type;
    this.scale = new Scale(this.root, type);
    this.notes = this.createChord();
  }

  createChord() {
    if ([Type.MAJOR, Type.MINOR, Type.DIMINISHED].includes(this.type)) {
      return [this.scale.notes[0], this.scale.notes[2], this.scale.notes[4]];
    } else if ([Type.MAJOR_SEVEN, Type.MINOR_SEVEN].includes(this.type)) {
      return [
        this.scale.notes[0],
        this.scale.notes[2],
        this.scale.notes[4],
        this.scale.notes[6],
      ];
    } else if (this.type === Type.SUS_TWO) {
      return [this.scale.notes[0], this.scale.notes[1], this.scale.notes[4]];
    } else if (this.type === Type.SUS_FOUR) {
      return [this.scale.notes[0], this.scale.notes[3], this.scale.notes[4]];
    } else if ([Type.MAJOR_NINE, Type.MINOR_NINE].includes(this.type)) {
      return [
        this.scale.notes[0],
        this.scale.notes[2],
        this.scale.notes[4],
        this.scale.notes[6],
        this.scale.notes[1],
      ];
    } else if (this.type === Type.SEVEN) {
      return [
        this.scale.notes[0],
        this.scale.notes[2],
        this.scale.notes[4],
        this.scale.notes[6],
      ];
    } else if (this.type === Type.AUGMENTED) {
      return [
        this.scale.notes[0],
        this.scale.notes[2],
        this.scale.notes[4].halfStep(),
      ];
    } else if (this.type === Type.ADD_NINE) {
      return [
        this.scale.notes[0],
        this.scale.notes[2],
        this.scale.notes[4],
        this.scale.notes[1],
      ];
    }
  }

  reset() {
    this.root = this.originalRoot;
    this.scale = new Scale(this.root, this.type);
    this.notes = this.createChord();
  }

  transpose(steps = 1, direction = Direction.UP, wholeStep = false) {
    for (let i = 0; i < steps; i++) {
      this.notes = this.notes.map((n) =>
        wholeStep ? n.wholeStep(direction) : n.halfStep(direction)
      );
    }
    this.root = this.notes[0];
    this.scale = new Scale(this.root, this.type);
  }

  getName() {
    return `${this.root.getName()} ${this.type}`;
  }

  enharmonic() {
    return this.notes.map((c) => c.enharmonic());
  }

  sameNotes(otherNotes) {
    if (otherNotes.length !== this.notes.length) {
      return false;
    }

    var otherNoteLetters = otherNotes.map(
      (n) => `${n.getLetter()} ${n.getSign()}`
    );
    var currNoteLetters = this.notes.map(
      (n) => `${n.getLetter()} ${n.getSign()}`
    );

    if (otherNoteLetters.every((n) => currNoteLetters.includes(n))) {
      return true;
    }

    var otherNoteMismatches = otherNotes.filter(
      (note) =>
        !currNoteLetters.includes(`${note.getLetter()} ${note.getSign()}`)
    );

    var thisNoteMismatches = this.notes.filter(
      (note) =>
        !otherNoteLetters.includes(`${note.getLetter()} ${note.getSign()}`)
    );

    var matchesEnharmonics =
      thisNoteMismatches.filter(
        (note) =>
          !otherNoteMismatches
            .map(
              (n) => `${n.enharmonic().getLetter()} ${n.enharmonic().getSign()}`
            )
            .includes(`${note.getLetter()} ${note.getSign()}`)
      ).length === 0;

    return matchesEnharmonics;
  }

  equals(chord) {
    if (!this.root.equals(chord.root)) {
      return false;
    }

    return this.sameNotes(chord.notes);
  }
}

var chords = Object.entries(Type).flatMap(([_, v]) =>
  allNotes.map((n) => new Chord(new Note(n.getLetter(), n.getSign()), v))
);

export const allChords = Array.from(
  new Map(chords.map((c) => [c.getName(), c])).values()
);
// for debugging
//   .filter(
//   (c) =>
//     c.root.getLetter() === "E" &&
//     c.root.sign === Sign.FLAT &&
//     c.type === Type.AUGMENTED
// );

// console.log(allChords[0].scale);
// console.log(allChords[0].notes);
