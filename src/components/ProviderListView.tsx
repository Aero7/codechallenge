import type { ProviderViewProps } from "./ProviderList";
import RegexInput from "./RegexInput";
import {
  PROVIDER_FIELD_TITLES,
  PROVIDER_INPUT_ERROR_MESSAGES,
  PROVIDER_INPUT_REGEXS,
} from "../constants";

export default function ProviderListView({
  sortedData,
  selected,
  handleSelect,
  handleSelectAll,
  editingCell,
  cellInput,
  handleCellDoubleClick,
  handleCellInputChange,
  handleCellInputBlur,
  handleCellInputKeyDown,
}: ProviderViewProps) {
  // Helper to render a cell with RegexInput if editing, else plain value
  function renderEditableCell(
    idx: number,
    col: keyof typeof PROVIDER_INPUT_REGEXS,
    value: string
  ) {
    if (editingCell && editingCell.row === idx && editingCell.col === col) {
      return (
        <RegexInput
          field={col}
          value={cellInput}
          onChange={(val) =>
            handleCellInputChange({
              target: { value: val },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          regex={PROVIDER_INPUT_REGEXS[col]}
          errorMessage={PROVIDER_INPUT_ERROR_MESSAGES[col]}
          placeholder={PROVIDER_FIELD_TITLES[col]}
          onBlur={() => handleCellInputBlur(idx, col)}
          onKeyDown={(e) => handleCellInputKeyDown(e, col)}
          dataTestId={`cell-input-${idx}-${col}`}
          usePopover
        />
      );
    }
    return value;
  }

  // Helper to render the provider details
  function renderProviderDetails(provider: any, idx: number) {
    return (
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
        <td>
          <div className="provider-details">
            <div className="provider-contact">
              {/* Last Name, First Name */}
              <h5
                style={{
                  cursor: "pointer",
                  display: "inline-block",
                }}
                onDoubleClick={() =>
                  handleCellDoubleClick(idx, "last_name", provider.last_name)
                }
                data-testid={`cell-${idx}-last_name`}
              >
                {renderEditableCell(idx, "last_name", provider.last_name)}
              </h5>
              <span>, </span>
              <h5
                style={{ cursor: "pointer", display: "inline-block" }}
                onDoubleClick={() =>
                  handleCellDoubleClick(idx, "first_name", provider.first_name)
                }
                data-testid={`cell-${idx}-first_name`}
              >
                {renderEditableCell(idx, "first_name", provider.first_name)}
              </h5>
              <br />
              {/* Email */}
              <a
                href={`mailto:${provider.email_address}`}
                style={{ cursor: "pointer" }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  handleCellDoubleClick(
                    idx,
                    "email_address",
                    provider.email_address
                  );
                }}
                data-testid={`cell-${idx}-email_address`}
              >
                {renderEditableCell(
                  idx,
                  "email_address",
                  provider.email_address
                )}
              </a>
            </div>

            <div className="provider-specs">
              {/* Specialty */}
              <div
                className="fs-5"
                style={{ cursor: "pointer" }}
                onDoubleClick={() =>
                  handleCellDoubleClick(idx, "specialty", provider.specialty)
                }
                data-testid={`cell-${idx}-specialty`}
              >
                {renderEditableCell(idx, "specialty", provider.specialty)}
              </div>
              {/* Practice Name */}
              <div
                style={{ cursor: "pointer" }}
                onDoubleClick={() =>
                  handleCellDoubleClick(
                    idx,
                    "practice_name",
                    provider.practice_name
                  )
                }
                data-testid={`cell-${idx}-practice_name`}
              >
                {renderEditableCell(
                  idx,
                  "practice_name",
                  provider.practice_name
                )}
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <table
      data-testid="provider-list"
      className="table table-striped table-bordered table-hover table-responsive mb-0"
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
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map(({ provider, idx }) =>
          renderProviderDetails(provider, idx)
        )}
      </tbody>
    </table>
  );
}
