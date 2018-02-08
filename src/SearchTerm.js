import React from "react";

const SearchTerm = props => (
  <li key={props.index} className="text-left py-0 list-group-item">
    {props.item}
  </li>
);

export default SearchTerm;
