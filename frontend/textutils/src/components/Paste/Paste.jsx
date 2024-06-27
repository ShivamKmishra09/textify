import React from "react";

const Paste = ({ paste, onDelete }) => (
  <div>
    <h2>{paste.title}</h2>
    <p>{paste.content}</p>
    <button onClick={() => onDelete(paste.id)}>Delete</button>
  </div>
);

export default Paste;
