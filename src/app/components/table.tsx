"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { Issue } from "../type";

// Props for the Table component
type TableProps = {
  issues: Issue[];
};

const Table = ({ issues }: TableProps) => {
  // Tracks checkbox state for each issue
  const [checked, setChecked] = useState<boolean[]>(
    new Array(issues.length).fill(false)
  );
  // Tracks the state of the "select all" checkbox
  const [selectAll, setSelectAll] = useState(false);
  // Sum of values of all selected and open issues
  const [totalSelectedValue, setTotalSelectedValue] = useState(0);

  // Whenever individual checkboxes update, evaluate indeterminate state
  useEffect(() => {
    updateIndeterminateState();
  }, [checked]);

  // Toggle individual issue checkbox
  const handleCheckboxChange = (index: number): void => {
    const updatedChecked = [...checked];
    updatedChecked[index] = !updatedChecked[index];
    setChecked(updatedChecked);
    updateTotalSelectedValue(updatedChecked);
  };

  // Recalculate the sum of selected issue values
  const updateTotalSelectedValue = (checkedArray: boolean[]): void => {
    const total = checkedArray.reduce(
      (sum, isChecked, i) =>
        isChecked && issues[i].status === "open" ? sum + issues[i].value : sum,
      0
    );
    setTotalSelectedValue(total);
  };

  // Handler for the "select all" checkbox
  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>): void => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);

    // Only select open issues
    const updatedChecked = issues.map((issue) =>
      issue.status === "open" ? isChecked : false
    );
    setChecked(updatedChecked);
    updateTotalSelectedValue(updatedChecked);
  };

  // Updates indeterminate state for the master checkbox
  const updateIndeterminateState = () => {
    const checkbox = document.getElementById(
      "select-all"
    ) as HTMLInputElement | null;
    if (!checkbox) return;

    const openIssuesCount = issues.filter((i) => i.status === "open").length;
    const selectedOpen = checked.filter(
      (_, i) => issues[i].status === "open" && checked[i]
    ).length;

    checkbox.indeterminate = selectedOpen > 0 && selectedOpen < openIssuesCount;
    setSelectAll(selectedOpen === openIssuesCount);
  };

  return (
    <table className="w-full border-collapse shadow-lg">
      <thead>
        {/* Header Row: Master checkbox + selected value */}
        <tr className="border-2 border-gray-200">
          <th className="py-6 pl-6 text-left w-[48px]">
            <input
              id="select-all"
              type="checkbox"
              className="w-5 h-5 cursor-pointer"
              checked={selectAll}
              onChange={handleSelectAll}
            />
          </th>
          <th className="py-6 min-w-[8rem] text-left text-black">
            {totalSelectedValue
              ? `Selected ${totalSelectedValue}`
              : "None selected"}
          </th>
          <th colSpan={2} />
        </tr>
        {/* Column labels */}
        <tr className="border-2 border-gray-200">
          <th className="py-6 pl-6" />
          <th className="py-6 text-left font-medium text-black">Name</th>
          <th className="py-6 text-left font-medium text-black">Message</th>
          <th className="py-6 text-left font-medium text-black">Status</th>
        </tr>
      </thead>
      <tbody>
        {/* Row rendering */}
        {issues.map(({ name, message, status }, i) => {
          const isOpen = status === "open";
          const rowClasses = `border-b border-gray-200 ${
            isOpen
              ? "cursor-pointer hover:bg-blue-50 text-black"
              : "text-gray-600 cursor-not-allowed"
          } ${checked[i] ? "bg-blue-50" : ""}`;

          return (
            <tr
              key={i}
              className={rowClasses}
              onClick={isOpen ? () => handleCheckboxChange(i) : undefined}
            >
              <td className="py-6 pl-6">
                <input
                  type="checkbox"
                  className={`w-5 h-5 ${
                    !isOpen ? "opacity-50" : "cursor-pointer"
                  }`}
                  disabled={!isOpen}
                  checked={checked[i]}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCheckboxChange(i);
                  }}
                />
              </td>
              <td className="py-6">{name}</td>
              <td className="py-6">{message}</td>
              <td className="py-6">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-[15px] h-[15px] rounded-full ${
                      isOpen ? "bg-blue-600" : "bg-gray-400"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      isOpen ? "text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {isOpen ? "Open" : "Resolved"}
                  </span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;

// Refactor Notes:
// - Removed unnecessary backgroundColor tracking; CSS classes handle row color.
// - Replaced `CheckedState` object with a simpler `boolean[]` for clarity.
// - Extracted reusable logic into helpers like `updateTotalSelectedValue`.
// - Used `useEffect` to manage indeterminate checkbox state.
// - Preserved original design and layout 100%.
