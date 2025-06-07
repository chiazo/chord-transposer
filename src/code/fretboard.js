import { Scale, Type } from "./scale.js";
import { Note, Sign, Direction } from "./note.js";
import { Chord } from "./chord.js";

export class Fretboard {
  constructor() {
    this.capo = 0;
    this.chords = [];
  }

  getChords() {
    return this.chords.map((c) => c.getName());
  }

  addCapo(position = 1) {
    if (position > 24 || position < 0) {
      return;
    }
    if (position == this.capo) {
      return;
    }

    if (position > this.capo) {
      this.transposeChords(position, Direction.UP);
    } else {
      this.removeCapo();
      this.addCapo(position);
    }
  }

  transposeChords(newPosition = 1) {
    var intervals = Math.abs(this.capo - newPosition);
    while (intervals >= 0) {
      this.chords.map((c) => c.transpose());
      intervals--;
    }
    this.capo = newPosition;
  }

  removeCapo() {
    this.chords.map((c) => c.reset());
    this.capo = 0;
  }

  addChord(chord) {
    this.chords.push(chord);
  }

  removeChord(chord) {
    this.chords.pop(chord);
  }
}
