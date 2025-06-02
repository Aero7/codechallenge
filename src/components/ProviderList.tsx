import { useState } from "react";
import RegexInput from "./RegexInput";
import type { ProviderData } from "../App";
import { PROVIDER_FIELD_TITLES } from "../constants";

type SortKey = keyof ProviderData;
type SortDirection = "asc" | "desc";

interface ProviderListProps {
  providers: ProviderData[];
  onRemove: (indexes: number[]) => void;
}

export default function ProviderList({
  providers,
  onRemove,
}: ProviderListProps) {
  const [viewMode, setViewMode] = useState<"table" | "list">("list");
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("last_name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selected, setSelected] = useState<Set<number>>(new Set());

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
      return viewMode === "table" ? renderTable() : renderList();
    }
  }

  function renderTable() {
    // Define the order and keys for columns
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
                <td key={col}>{provider[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function renderList() {
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
                    <h5>{provider.last_name + ", " + provider.first_name}</h5>
                    <a href={`mailto:${provider.email_address}`}>
                      {provider.email_address}
                    </a>
                  </div>

                  <div className="provider-specs">
                    <div className="fs-5">{provider.specialty}</div>
                    <div>{provider.practice_name}</div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
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
