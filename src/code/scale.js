import { Direction, Note, Sign } from "./note.js";

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
  // whole-whole-half-whole-whole-whole-half
  static major_scale_pattern = "1101110";
  // whole-half-whole-whole-half-whole-whole
  static minor_scale_pattern = "1011011";
  static cof_sharps = ["C", "G", "D", "A", "E", "B", "F SHARP", "C SHARP"];
  static cof_flats = [
    "C",
    "F",
    "B FLAT",
    "E FLAT",
    "A FLAT",
    "D FLAT",
    "G FLAT",
    "C FLAT",
  ];

  constructor(root, type = Type.MAJOR) {
    this.root = root;
    this.type = type;
    this.notes = Scale.createScale(root, type);
  }

  static createScale(root, type) {
    return type.indexOf(Type.MAJOR) >= 0 || type.indexOf("SUS") >= 0
      ? Scale.createMajorScale(root)
      : Scale.createMinorScale(root);
  }

  static createMajorScale(root) {
    return Scale.populateScale(root, Scale.major_scale_pattern);
  }

  static createMinorScale(root) {
    return Scale.populateScale(root, Scale.minor_scale_pattern);
  }

  getCircleOfFifthScale(sign = Sign.SHARP) {
    var cof_base = Scale.populateScale(
      new Note("C"),
      Scale.major_scale_pattern
    );
    var sharp_count = Scale.cof_sharps.indexOf(this.root.getName());
    var flat_count = Scale.cof_flats.indexOf(this.root.getName());
    var note_in_base = cof_base.find(
      (n) => n.getLetter() == this.root.getLetter()
    );

    if (
      (sign == Sign.SHARP && sharp_count == 0) ||
      (sign == Sign.FLAT && flat_count == 0)
    ) {
      return;
    }

    console.log(
      `note to make ${sign}:`,
      cof_base[cof_base.indexOf(note_in_base) - 1]
    );

    if (sign == Sign.SHARP) {
      console.log("cof_sharps", sharp_count);
    } else {
      console.log("cof_flats", flat_count);
    }
  }

  static populateScale(root, pattern) {
    var notes = [root];
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
      if (notes[i - 1].getLetter() == notes[i].getLetter()) {
        notes[i] = notes[i].enharmonic();
      }
    }
    return notes;
  }
}
