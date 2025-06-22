import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { Chord } from "../code/chord";

const Section = ({ name }) => {
  const [chords, setChords] = useState([
    new Chord("A"),
    new Chord("B"),
    new Chord("C"),
    new Chord("D"),
  ]);
  return (
    <div className="section">
      <div className="section-name">{name}</div>
      <ReactSortable list={chords} setList={setChords}>
        {chords.map((c, idx) => (
          <div key={idx}>{c.getName()}</div>
        ))}
      </ReactSortable>
    </div>
  );
};

export default Section;
