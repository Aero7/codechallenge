import { useState } from "react";
import RegexInput from "./RegexInput";
import type { ProviderData } from "../App";
import { PROVIDER_FIELD_TITLES, PROVIDER_INPUT_REGEXS } from "../constants";
import ProviderListView from "./ProviderListView";
import ProviderTable from "./ProviderTable";

type SortKey = keyof ProviderData;
type SortDirection = "asc" | "desc";

interface ProviderListProps {
  providers: ProviderData[];
  onRemove: (indexes: number[]) => void;
  onUpdateProviders: (providers: ProviderData[]) => void;
}

export interface ProviderViewProps {
  sortedData: { provider: ProviderData; idx: number }[];
  selected: Set<number>;
  handleSelect: (idx: number) => void;
  handleSelectAll: () => void;
  handleSort: (col: keyof ProviderData) => void;
  getSortIndicator: (col: keyof ProviderData) => string;
  editingCell: { row: number; col: keyof ProviderData } | null;
  cellInput: string;
  handleCellDoubleClick: (
    rowIdx: number,
    col: keyof ProviderData,
    value: string
  ) => void;
  handleCellInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCellInputBlur: (rowIdx: number, col: keyof ProviderData) => void;
  handleCellInputKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    col: keyof ProviderData
  ) => void;
}

export default function ProviderList({
  providers,
  onRemove,
  onUpdateProviders,
}: ProviderListProps) {
  const [viewMode, setViewMode] = useState<"table" | "list">("list");
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("last_name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: keyof ProviderData;
  } | null>(null);
  const [cellInput, setCellInput] = useState<string>("");

  const filteredData = providers
    .map((provider, idx) => ({ provider, idx }))
    .filter(
      ({ provider }) =>
        provider.first_name.toLowerCase().includes(filter.toLowerCase()) ||
        provider.last_name.toLowerCase().includes(filter.toLowerCase()) ||
        provider.email_address.toLowerCase().includes(filter.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(filter.toLowerCase()) ||
        provider.practice_name.toLowerCase().includes(filter.toLowerCase())
    );

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a.provider[sortKey].toLowerCase();
    const bValue = b.provider[sortKey].toLowerCase();
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  const handleSelect = (idx: number) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selected.size === sortedData.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sortedData.map((row) => row.idx)));
    }
  };

  const handleRemove = () => {
    onRemove(Array.from(selected));
    setSelected(new Set());
  };

  function handleCellDoubleClick(
    rowIdx: number,
    col: keyof ProviderData,
    value: string
  ) {
    setEditingCell({ row: rowIdx, col });
    setCellInput(value);
  }

  function handleCellInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCellInput(e.target.value);
  }

  function handleCellInputBlur(rowIdx: number, col: keyof ProviderData) {
    if (PROVIDER_INPUT_REGEXS[col].test(cellInput)) {
      if (cellInput.trim() !== providers[rowIdx][col]) {
        const updatedProviders = providers.map((p, idx) =>
          idx === rowIdx ? { ...p, [col]: cellInput } : p
        );
        onUpdateProviders(updatedProviders);
      }
      setEditingCell(null);
    }
  }

  function handleCellInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "Escape") {
      setEditingCell(null);
      setCellInput("");
    }
  }

  function renderProviders() {
    if (sortedData.length === 0) {
      return (
        <div className="text-center text-muted">
          {filter
            ? "No providers match the current filter."
            : "No providers available."}
        </div>
      );
    } else {
      return viewMode === "table" ? (
        <ProviderTable
          sortedData={sortedData}
          selected={selected}
          handleSelect={handleSelect}
          handleSelectAll={handleSelectAll}
          handleSort={handleSort}
          getSortIndicator={getSortIndicator}
          editingCell={editingCell}
          cellInput={cellInput}
          handleCellDoubleClick={handleCellDoubleClick}
          handleCellInputChange={handleCellInputChange}
          handleCellInputBlur={handleCellInputBlur}
          handleCellInputKeyDown={handleCellInputKeyDown}
        />
      ) : (
        <ProviderListView
          sortedData={sortedData}
          selected={selected}
          handleSelect={handleSelect}
          handleSelectAll={handleSelectAll}
          handleSort={() => ""}
          getSortIndicator={() => ""}
          editingCell={editingCell}
          cellInput={cellInput}
          handleCellDoubleClick={handleCellDoubleClick}
          handleCellInputChange={handleCellInputChange}
          handleCellInputBlur={handleCellInputBlur}
          handleCellInputKeyDown={handleCellInputKeyDown}
        />
      );
    }
  }

  return (
    <div id="provider-list">
      <div className="card border-primary">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Provider List</span>
        </div>

        <div className="card-body">
          <div id="table-controls">
            <button
              className="btn btn-outline-primary btn-sm"
              type="button"
              onClick={() =>
                setViewMode(viewMode === "table" ? "list" : "table")
              }
              data-testid="toggle-view-btn"
            >
              {viewMode === "table" ? "List View" : "Table View"}
            </button>

            <div id="filter-input" className="input-group">
              <span className="input-group-text">Filter</span>
              <RegexInput
                value={filter}
                onChange={setFilter}
                placeholder="Enter filter value..."
              />
            </div>

            <div id="sort-controls">
              <div className="input-group">
                <span className="input-group-text">Sort</span>
                <select
                  id="sort-key"
                  data-testid="sort-key-select"
                  className="form-select form-select-sm w-auto"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                >
                  {Object.entries(PROVIDER_FIELD_TITLES).map(([key, title]) => (
                    <option key={key} value={key}>
                      {title}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-testid="sort-direction-toggle"
                  onClick={() =>
                    setSortDirection((prev) =>
                      prev === "asc" ? "desc" : "asc"
                    )
                  }
                  aria-label="Toggle sort direction"
                >
                  {sortDirection === "asc" ? "▲" : "▼"}
                </button>
              </div>
            </div>
          </div>

          <div id="provider-content">{renderProviders()}</div>
          <div className="mt-3 d-flex justify-content-end">
            <button
              className="btn btn-danger"
              onClick={handleRemove}
              disabled={selected.size === 0}
              data-testid="remove-btn"
            >
              Remove {selected.size > 0 ? `(${selected.size})` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
