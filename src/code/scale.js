import { Direction } from "./note.js";

export const Type = {
  MAJOR: "MAJOR",
  MINOR: "MINOR",
};
export class Scale {
  constructor(root, type = Type.MAJOR) {
    this.root = root;
    this.type = type;
    this.notes = this.createScale();
  }

  createScale() {
    return this.type == Type.MAJOR
      ? this.createMajorScale()
      : this.createMinorScale();
  }

  createMajorScale() {
    // whole-whole-half-whole-whole-whole-half
    return this.populateScale("1101110");
  }

  createMinorScale() {
    // whole-half-whole-whole-half-whole-whole
    return this.populateScale("1011011");
  }

  populateScale(pattern) {
    var notes = [this.root];
    pattern
      .split("")
      .slice(0, 6)
      .forEach((interval) =>
        notes.push(
          parseInt(interval)
            ? notes[notes.length - 1].wholeStep(Direction.UP)
            : notes[notes.length - 1].halfStep(Direction.UP)
        )
      );
    return notes;
  }
}