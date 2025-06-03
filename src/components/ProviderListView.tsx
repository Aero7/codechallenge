import type { ProviderViewProps } from "./ProviderList";

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
                      handleCellDoubleClick(
                        idx,
                        "last_name",
                        provider.last_name
                      )
                    }
                    data-testid={`cell-${idx}-last_name`}
                  >
                    {editingCell &&
                    editingCell.row === idx &&
                    editingCell.col === "last_name" ? (
                      <input
                        type="text"
                        value={cellInput}
                        autoFocus
                        onChange={handleCellInputChange}
                        onBlur={() => handleCellInputBlur(idx, "last_name")}
                        onKeyDown={handleCellInputKeyDown}
                        style={{ width: "45%" }}
                        data-testid={`cell-input-${idx}-last_name`}
                      />
                    ) : (
                      provider.last_name
                    )}
                  </h5>
                  <span>, </span>
                  <h5
                    style={{ cursor: "pointer", display: "inline-block" }}
                    onDoubleClick={() =>
                      handleCellDoubleClick(
                        idx,
                        "first_name",
                        provider.first_name
                      )
                    }
                    data-testid={`cell-${idx}-first_name`}
                  >
                    {editingCell &&
                    editingCell.row === idx &&
                    editingCell.col === "first_name" ? (
                      <input
                        type="text"
                        value={cellInput}
                        autoFocus
                        onChange={handleCellInputChange}
                        onBlur={() => handleCellInputBlur(idx, "first_name")}
                        onKeyDown={handleCellInputKeyDown}
                        style={{ width: "45%" }}
                        data-testid={`cell-input-${idx}-first_name`}
                      />
                    ) : (
                      provider.first_name
                    )}
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
                    {editingCell &&
                    editingCell.row === idx &&
                    editingCell.col === "email_address" ? (
                      <input
                        type="text"
                        value={cellInput}
                        autoFocus
                        onChange={handleCellInputChange}
                        onBlur={() => handleCellInputBlur(idx, "email_address")}
                        onKeyDown={handleCellInputKeyDown}
                        style={{ width: "90%" }}
                        data-testid={`cell-input-${idx}-email_address`}
                      />
                    ) : (
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
                      handleCellDoubleClick(
                        idx,
                        "specialty",
                        provider.specialty
                      )
                    }
                    data-testid={`cell-${idx}-specialty`}
                  >
                    {editingCell &&
                    editingCell.row === idx &&
                    editingCell.col === "specialty" ? (
                      <input
                        type="text"
                        value={cellInput}
                        autoFocus
                        onChange={handleCellInputChange}
                        onBlur={() => handleCellInputBlur(idx, "specialty")}
                        onKeyDown={handleCellInputKeyDown}
                        style={{ width: "90%" }}
                        data-testid={`cell-input-${idx}-specialty`}
                      />
                    ) : (
                      provider.specialty
                    )}
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
                    {editingCell &&
                    editingCell.row === idx &&
                    editingCell.col === "practice_name" ? (
                      <input
                        type="text"
                        value={cellInput}
                        autoFocus
                        onChange={handleCellInputChange}
                        onBlur={() => handleCellInputBlur(idx, "practice_name")}
                        onKeyDown={handleCellInputKeyDown}
                        style={{ width: "90%" }}
                        data-testid={`cell-input-${idx}-practice_name`}
                      />
                    ) : (
                      provider.practice_name
                    )}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
