"use client";

import { useState, ChangeEvent } from "react";

export type Issue = {
  id: string;
  name: string;
  message: string;
  status: "open" | "resolved";
  numEvents: number;
  numUsers: number;
  value: number;
};

type CheckedState = {
  checked: boolean;
  backgroundColor: string;
};

type TableProps = {
  issues: Issue[];
};

const Table = ({ issues }: TableProps) => {
  const [checkedState, setCheckedState] = useState<CheckedState[]>(
    new Array(issues.length).fill({
      checked: false,
      backgroundColor: "#ffffff",
    })
  );
  const [selectDeselectAllIsChecked, setSelectDeselectAllIsChecked] =
    useState(false);
  const [numCheckboxesSelected, setNumCheckboxesSelected] = useState(0);

  const handleOnChange = (position: number): void => {
    const updatedCheckedState = checkedState.map((element, index) => {
      if (position === index) {
        return {
          ...element,
          checked: !element.checked,
          backgroundColor: element.checked ? "#ffffff" : "#eeeeee",
        };
      }
      return element;
    });
    setCheckedState(updatedCheckedState);

    const totalSelected = updatedCheckedState
      .map((element) => element.checked)
      .reduce((sum, currentState, index) => {
        if (currentState) {
          return sum + issues[index].value;
        }
        return sum;
      }, 0);
    setNumCheckboxesSelected(totalSelected);

    handleIndeterminateCheckbox(totalSelected);
  };

  const handleIndeterminateCheckbox = (total: number): void => {
    const indeterminateCheckbox = document.getElementById(
      "custom-checkbox-selectDeselectAll"
    ) as HTMLInputElement | null;

    if (!indeterminateCheckbox) return;

    let count = 0;

    issues.forEach((element) => {
      if (element.status === "open") {
        count += 1;
      }
    });

    if (total === 0) {
      indeterminateCheckbox.indeterminate = false;
      setSelectDeselectAllIsChecked(false);
    }
    if (total > 0 && total < count) {
      indeterminateCheckbox.indeterminate = true;
      setSelectDeselectAllIsChecked(false);
    }
    if (total === count) {
      indeterminateCheckbox.indeterminate = false;
      setSelectDeselectAllIsChecked(true);
    }
  };

  const handleSelectDeselectAll = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { checked } = event.target;

    const allTrueArray: CheckedState[] = [];
    issues.forEach((element) => {
      if (element.status === "open") {
        allTrueArray.push({ checked: true, backgroundColor: "#eeeeee" });
      } else {
        allTrueArray.push({ checked: false, backgroundColor: "#ffffff" });
      }
    });

    const allFalseArray: CheckedState[] = new Array(issues.length).fill({
      checked: false,
      backgroundColor: "#ffffff",
    });

    setCheckedState(checked ? allTrueArray : allFalseArray);

    const totalSelected = (checked ? allTrueArray : allFalseArray)
      .map((element) => element.checked)
      .reduce((sum, currentState, index) => {
        if (currentState && issues[index].status === "open") {
          return sum + issues[index].value;
        }
        return sum;
      }, 0);
    setNumCheckboxesSelected(totalSelected);
    setSelectDeselectAllIsChecked((prevState) => !prevState);
  };

  return (
    <table className="w-full border-collapse shadow-lg">
      <thead>
        <tr className="border-2 border-gray-200">
          <th className="py-6 pl-6 text-left w-[48px]">
            <input
              className="w-5 h-5 cursor-pointer"
              type="checkbox"
              id="custom-checkbox-selectDeselectAll"
              name="custom-checkbox-selectDeselectAll"
              value="custom-checkbox-selectDeselectAll"
              checked={selectDeselectAllIsChecked}
              onChange={handleSelectDeselectAll}
            />
          </th>
          <th className="py-6 min-w-[8rem] text-left text-black">
            {numCheckboxesSelected
              ? `Selected ${numCheckboxesSelected}`
              : "None selected"}
          </th>
          <th colSpan={2} />
        </tr>
        <tr className="border-2 border-gray-200">
          <th className="py-6 pl-6" />
          <th className="py-6 text-left font-medium text-black">Name</th>
          <th className="py-6 text-left font-medium text-black">Message</th>
          <th className="py-6 text-left font-medium text-black">Status</th>
        </tr>
      </thead>

      <tbody>
        {issues.map(({ name, message, status }, index) => {
          const issueIsOpen = status === "open";
          const onClick = issueIsOpen ? () => handleOnChange(index) : undefined;
          const rowClasses = `${
            issueIsOpen
              ? "cursor-pointer hover:bg-blue-50 text-black"
              : "text-gray-600 cursor-not-allowed"
          } border-b border-gray-200 ${
            checkedState[index].checked ? "bg-blue-50" : ""
          }`;

          return (
            <tr className={rowClasses} key={index} onClick={onClick}>
              <td className="py-6 pl-6">
                {issueIsOpen ? (
                  <input
                    className="w-5 h-5 cursor-pointer"
                    type="checkbox"
                    id={`custom-checkbox-${index}`}
                    name={name}
                    value={name}
                    checked={checkedState[index].checked}
                    onChange={() => handleOnChange(index)}
                  />
                ) : (
                  <input
                    className="w-5 h-5 opacity-50"
                    type="checkbox"
                    disabled
                  />
                )}
              </td>
              <td className="py-6">{name}</td>
              <td className="py-6">{message}</td>
              <td className="py-6">
                <div className="flex items-center gap-2">
                  {issueIsOpen ? (
                    <>
                      <span className="inline-block w-[15px] h-[15px] rounded-full bg-blue-600" />
                      <span className="text-blue-700 font-medium">Open</span>
                    </>
                  ) : (
                    <>
                      <span className="inline-block w-[15px] h-[15px] rounded-full bg-gray-400" />
                      <span className="text-gray-700 font-medium">
                        Resolved
                      </span>
                    </>
                  )}
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
