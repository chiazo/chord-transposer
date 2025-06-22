import { Note, Sign } from "./note.js";
import { allChords } from "./chord.js";
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
    return chords.map((c) => c.transpose(fret));
  }

  // given multiple notes, returns which chord is being played
  findChord(notes) {
    for (const chord of allChords) {
      if (chord.sameNotes(notes)) {
        return chord;
      }
    }
  }

  getNotes(chords) {
    var result = this.transposeChords(chords, 4);
    console.log("result", chords);
    return result.map((c) => c.notes);
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
  new Note("F", Sign.SHARP),
  new Note("A", Sign.SHARP),
  new Note("C", Sign.SHARP),
  new Note("G", Sign.SHARP),
];

console.log(
  "to find",
  notesToFind.map((n) => n.getName())
);
console.log("------- searching .... ------");
console.log(
  `found ${program.findChord(notesToFind).getName()}!`,
  program.findChord(notesToFind).notes.map((n) => n.getName())
);
console.log(program.getUniqueNotes([program.findChord(notesToFind)]));
