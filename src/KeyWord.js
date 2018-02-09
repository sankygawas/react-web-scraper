import React from "react";
import SearchTerm from "./SearchTerm";

const KeyWord = props => (
  <tr >
    <td className="text-left p-0">
      <span className="ml-2">
        <strong>{props.keyWord.key}</strong> ({props.keyWord.values.length})
      </span>
      <ul className="list-group my-0">
        {props.keyWord.values.map((item, i) => (
          <SearchTerm key={i} item={item} />
        ))}
      </ul>
    </td>
  </tr>
);

export default KeyWord;
