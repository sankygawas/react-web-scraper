import React from "react";
import SearchTerm from "./SearchTerm";

const KeyWord = props => (
  <tr key={props.index}>
    <td className="text-left p-0">
      <span className="ml-2">
        <strong>{props.keyWord.key}</strong> ({props.keyWord.values.length})
      </span>
      <ul className="list-group my-0">
        {props.keyWord.values.map((item, i) => (
          <SearchTerm item={item} index={i} />
        ))}
      </ul>
    </td>
  </tr>
);

export default KeyWord;
