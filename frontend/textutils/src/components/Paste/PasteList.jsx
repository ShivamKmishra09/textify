import React from "react";
import Paste from "./Paste";

const PasteList = ({ pastes, onDelete }) => (
  <div>
    {pastes.map((paste) => (
      <Paste key={paste.id} paste={paste} onDelete={onDelete} />
    ))}
  </div>
);

export default PasteList;
