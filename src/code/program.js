import { Scale, Type } from "./scale.js";
import { Note, Sign, allNotes, Direction } from "./note.js";
import { Chord, allChords } from "./chord.js";
import { Fretboard } from "./fretboard.js";

export class Program {
  constructor() {
    this.fretboard = new Fretboard();
  }

  // given a chord and a fret, returns which note is being played
  transpose(chord, fret) {
    var f = new Fretboard();
    f.addChord(chord);
    f.addCapo(fret);
    return f.chords[0];
  }

  // given multiple chords and a fret, returns which note is being played
  transposeChords(chords, fret) {
    return chords.map((c) => this.transpose(c, fret));
  }

  // given multiple notes, returns which chord is being played
  findChord(notes) {
    for (const chord of allChords) {
      if (chord.sameNotes(notes)) {
        return chord.getName();
      }
    }
  }

  getNotes(chords) {
    return this.transposeChords(chords, 4).map((c) => c.notes);
  }

  getUniqueNotes(chords) {
    var noteList = this.getNotes(chords).reduce((list, notes) => {
      notes.forEach((n) => list.push(n.getName()));
      return list;
    }, []);
    var uniqueNotes = new Set(noteList);
    var noteMap = {};
    noteList.forEach((n) => {
      n in noteMap ? (noteMap[n] = noteMap[n] += 1) : (noteMap[n] = 1);
    });
    return uniqueNotes;
  }
}

var program = new Program();
var notesToFind = [
  new Note("B"),
  new Note("D", Sign.SHARP),
  new Note("F", Sign.SHARP),
  new Note("A", Sign.SHARP),
];

// console.log(
//   allChords
//     .filter(
//       (c) =>
//         c.type == Type.MAJOR_7 &&
//         c.root.sign == Sign.NATURAL &&
//         c.root.getLetter() == "B"
//     )
//     .map((c) => c.scale.notes)
// );

console.log(program.findChord(notesToFind), notesToFind);
// var scale = new Scale(new Note("E", Sign.FLAT));
// scale.getCircleOfFifthScale(Sign.FLAT);
// console.log(scale);
// console.log("cof_sharps", Scale.cof_sharps.indexOf(scale.root.getName()));
// console.log("cof_flats", Scale.cof_flats.indexOf(scale.root.getName()));
