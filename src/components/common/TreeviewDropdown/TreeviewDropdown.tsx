import React, { useContext, useEffect } from "react";
import DropdownTreeSelect from "react-dropdown-tree-select";
import { ThemeContext } from "../../../ContextMain";
const TreeviewDropdown = ({
  treedata,
  ontreeChange,
}: {
  treedata;
  ontreeChange;
}) => {
  const { DDmode } = useContext(ThemeContext);
  return (
    <DropdownTreeSelect
      texts={{
        placeholder: "                   ",
        inlineSearchPlaceholder: "Search",
        noMatches: `     No Options`,
      }}
      keepTreeOnSearch={true}
      inlineSearchInput={true}
      clearSearchOnChange={false}
      showPartiallySelected={true}
      //  keepOpenOnSelect={true}
      readOnly={false}
      disabled={false}
      data={treedata}
      className="bootstarp-demo"
      mode={DDmode}
      //  mode="radioSelect"
      // mode="simpleSelect"
      disablePoppingOnBackspace={false}
      onChange={ontreeChange}
    />
  );
};

export default TreeviewDropdown;
