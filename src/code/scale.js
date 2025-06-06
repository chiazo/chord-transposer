import { Direction } from "./note.js";

export const Type = {
  MAJOR: "MAJOR",
  MINOR: "MINOR",
  MAJOR_7: "MAJOR_7",
  MINOR_7: "MINOR_7",
  SUS_2: "SUS_2",
  SUS_4: "SUS_4",
  MAJOR_9: "MAJOR_9",
  MINOR_9: "MINOR_9",
};
export class Scale {
  constructor(root, type = Type.MAJOR) {
    this.root = root;
    this.type = type;
    this.notes = this.createScale();
  }

  createScale() {
    return this.type.indexOf(Type.MAJOR) >= 0 || this.type.indexOf("SUS") >= 0
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

      // TODO: fix this to work with circle of fifths
    for (let i = 1; i < notes.length; i++) {
      if (notes[i-1].getLetter() == notes[i].getLetter()) {
        notes[i] = notes[i].enharmonic()
      } 
    }
    return notes
  }
}