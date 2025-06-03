import type { ProviderData } from "../App";
import { PROVIDER_FIELD_TITLES } from "../constants";
import type { ProviderViewProps } from "./ProviderList";

export default function ProviderTable({
  sortedData,
  selected,
  handleSelect,
  handleSelectAll,
  handleSort,
  getSortIndicator,
  editingCell,
  cellInput,
  handleCellDoubleClick,
  handleCellInputChange,
  handleCellInputBlur,
  handleCellInputKeyDown,
}: ProviderViewProps) {
  const columns: (keyof ProviderData)[] = [
    "last_name",
    "first_name",
    "email_address",
    "specialty",
    "practice_name",
  ];

  return (
    <table
      data-testid="provider-table"
      className="table table-striped table-bordered table-hover mb-0"
    >
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              data-testid="select-all"
              checked={
                selected.size === sortedData.length && sortedData.length > 0
              }
              onChange={handleSelectAll}
              aria-label="Select all"
            />
          </th>
          {columns.map((col) => (
            <th
              key={col}
              onClick={() => handleSort(col)}
              data-testid={`header-${col}`}
              style={{ cursor: "pointer" }}
            >
              {PROVIDER_FIELD_TITLES[col]}
              {getSortIndicator(col)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map(({ provider, idx }) => (
          <tr key={idx}>
            <td>
              <input
                type="checkbox"
                data-testid={`select-row-${idx}`}
                checked={selected.has(idx)}
                onChange={() => handleSelect(idx)}
                aria-label={`Select row ${idx}`}
              />
            </td>
            {columns.map((col) => (
              <td
                key={col}
                onDoubleClick={() =>
                  handleCellDoubleClick(idx, col, provider[col])
                }
                style={{ cursor: "pointer" }}
                data-testid={`cell-${idx}-${col}`}
              >
                {editingCell &&
                editingCell.row === idx &&
                editingCell.col === col ? (
                  <input
                    type="text"
                    value={cellInput}
                    autoFocus
                    onChange={handleCellInputChange}
                    onBlur={() => handleCellInputBlur(idx, col)}
                    onKeyDown={handleCellInputKeyDown}
                    style={{ width: "95%" }}
                    data-testid={`cell-input-${idx}-${col}`}
                  />
                ) : (
                  provider[col]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
