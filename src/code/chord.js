import { Scale, Type } from "./scale.js";
export class Chord {
  constructor(root, type = Type.MAJOR) {
    this.root = root;
    this.type = type;
    this.scale = new Scale(root, type);
    this.notes = this.createChord();
  }

  createChord() {
    return [this.scale.notes[0], this.scale.notes[2], this.scale.notes[4]];
  }
}