import { Direction, Note, Sign } from "./note.js";

export const Type = {
  MAJOR: "MAJOR",
  MINOR: "MINOR",
  MAJOR_SEVEN: "MAJOR_SEVEN",
  MINOR_SEVEN: "MINOR_SEVEN",
  SUS_TWO: "SUS_TWO",
  SUS_FOUR: "SUS_FOUR",
  MAJOR_NINE: "MAJOR_NINE",
  MINOR_NINE: "MINOR_NINE",
  SEVEN: "SEVEN",
  DIMINISHED: "DIMINISHED",
  AUGMENTED: "AUGMENTED",
  ADD_NINE: "ADD_NINE",
};
export class Scale {
  // whole-whole-half-whole-whole-whole-half
  static major_scale_pattern = "1101110";
  // whole-half-whole-whole-half-whole-whole
  static minor_scale_pattern = "1011011";
  // whole-whole-half-whole-whole-half-whole
  static mixolydian_scale_pattern = "1101101";
  // half-whole-half-whole-half-whole-half
  static diminished_scale_pattern = "0101010";
  // whole-whole-whole-whole-whole-whole
  static whole_tone_scale_pattern = "111111";
  // minor3rd-half-minor3d-half-minor3rd-half
  static augmented_scale_pattern = "101010";
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
    if (type == Type.SEVEN) {
      return Scale.createMixolydianScale(root);
    }

    if (type == Type.DIMINISHED) {
      return Scale.createDiminishedScale(root);
    }

    return [Type.MAJOR, Type.AUGMENTED, Type.ADD_NINE].includes(type) ||
      type.includes("SUS")
      ? Scale.createMajorScale(root)
      : Scale.createMinorScale(root);
  }

  static createMajorScale(root) {
    return Scale.populateScale(root, Scale.major_scale_pattern);
  }

  static createMinorScale(root) {
    return Scale.populateScale(root, Scale.minor_scale_pattern);
  }

  static createMixolydianScale(root) {
    return Scale.populateScale(root, Scale.mixolydian_scale_pattern);
  }

  static createDiminishedScale(root) {
    return Scale.populateScale(root, Scale.diminished_scale_pattern);
  }

  static createWholeToneScale(root) {
    return Scale.populateScale(root, Scale.whole_tone_scale_pattern);
  }

  // ironically doesn't work on augmented, good for dominant 7th augmented chords (7#5)
  static createAugmentedScale(root) {
    return Scale.populateScale(root, Scale.augmented_scale_pattern);
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
      .slice(0, pattern.length - 1)
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
