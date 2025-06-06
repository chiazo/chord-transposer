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
        f.addChord(chord)
        f.addCapo(fret)
        return f.chords[0]
    }

    // given multiple chords and a fret, returns which note is being played
    transposeChords(chords, fret) {
        return chords.map(c => this.transpose(c, fret))
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
        return this.transposeChords(chords, 4).map(c => c.notes)
    }

    getUniqueNotes(chords) {
        var noteList = this.getNotes(chords).reduce((list, notes) => {
            notes.forEach(n => list.push(n.getName()));
            return list;
        }, [])
        var uniqueNotes = new Set(noteList)
        var noteMap = {}
        noteList.forEach(n => {
            n in noteMap ? noteMap[n] = noteMap[n] += 1 : noteMap[n] = 1
        })
        return uniqueNotes
    }
}

var program = new Program();
// var chords = [new Chord(new Note("B"), Type.MAJOR_7), new Chord(new Note("E"), Type.MINOR), new Chord(new Note("C"), Type.MAJOR_7), new Chord(new Note("G")), new Chord(new Note("A"), Type.MINOR_7)]
// console.log(program.transposeChords(chords, 4).map(c => c.getName()))
// var notesToFind = [new Note("A", Sign.FLAT), new Note("D", Sign.FLAT), new Note("E", Sign.FLAT)]
// console.log(program.findChord(notesToFind), notesToFind)
// console.log(allChords.map(c => c.getName()).filter(n => n.indexOf("SUS_4") >= 0))
// console.log(new Chord(allNotes.find(n => n.getName() == "A FLAT"), Type.SUS_4))
console.log(new Scale(new Note("C", Sign.SHARP)))