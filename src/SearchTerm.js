import React from "react";

const SearchTerm = props => (
  <li  className="text-left py-1 list-group-item">
    {props.index}. {props.item}
  </li>
);

export default SearchTerm;
