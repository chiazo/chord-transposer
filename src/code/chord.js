import { Scale, Type } from "./scale.js";
import { Note, Sign, Direction } from "./note.js";
export class Chord {
  constructor(root, type = Type.MAJOR) {
    this.root = root;
    this.type = type;
    this.scale = new Scale(root, type);
    this.notes = this.createChord();
  }

  createChord() {
    if ([Type.MAJOR, Type.MINOR].indexOf(this.type) >= 0) {
      return [this.scale.notes[0], this.scale.notes[2], this.scale.notes[4]];
    } else if ([Type.MAJOR_7, Type.MINOR_7].indexOf(this.type) >= 0) {
      return [this.scale.notes[0], this.scale.notes[2], this.scale.notes[4], this.scale.notes[6]];
    } else if (this.type == Type.SUS_2) {
      return [this.scale.notes[0], this.scale.notes[1], this.scale.notes[4]];
    } else if (this.type == Type.SUS_4) {
      return [this.scale.notes[0], this.scale.notes[3], this.scale.notes[4]];
    } else if ([Type.MAJOR_9, Type.MINOR_9].indexOf(this.type) >= 0) {
      return [this.scale.notes[0], this.scale.notes[2], this.scale.notes[4], this.scale.notes[6], this.scale.notes[1]];
    }
  }

  reset() {
    this.notes = this.createChord()
  }

  transpose(direction = Direction.UP, wholeStep = false) {
    this.notes = this.notes.map(n => wholeStep ? n.wholeStep(direction) : n.halfStep(direction))
  }

  getEnharmonic() {
    return this.notes.map(c => c.getEnharmonic());
  }

  equals(chord) {
    if (!this.root.equals(chord.root)) {
      return false;
    }

    if (chord.notes.toString() != this.notes.toString()) {
      return false;
    }

    if (chord.notes.map(c => c.getEnharmonic()).toString() != this.notes.toString()) {
      return false;
    }

    if (this.notes.map(c => c.getEnharmonic()).toString() != chord.notes.toString()) {
      return false;
    }

    return true;
  }
}
