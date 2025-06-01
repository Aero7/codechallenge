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

  return (
    <div id="provider-list">
      <div className="card border-primary">
        <div className="card-header">Provider List</div>
        <div className="card-body">
          <div id="table-controls">
            <div id="filter-input">
              <label className="form-label mb-0">Filter</label>

              <RegexInput
                value={filter}
                onChange={setFilter}
                placeholder="Filter by any field"
              />
            </div>

            <div id="sort-controls">
              <div>
                <label htmlFor="sort-key" className="form-label mb-0">
                  Sort by:
                </label>
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
              </div>

              <div>
                <label htmlFor="sort-direction" className="form-label mb-0">
                  Direction:
                </label>

                <select
                  id="sort-direction"
                  data-testid="sort-direction-select"
                  className="form-select form-select-sm w-auto"
                  value={sortDirection}
                  onChange={(e) =>
                    setSortDirection(e.target.value as SortDirection)
                  }
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>

          <div id="provider-table">
            <table className="table table-striped table-bordered table-hover table-responsive mb-0">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      data-testid="select-all"
                      checked={
                        selected.size === sortedData.length &&
                        sortedData.length > 0
                      }
                      onChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </th>
                  <th
                    onClick={() => handleSort("last_name")}
                    data-testid="header-last_name"
                    style={{ cursor: "pointer" }}
                  >
                    Last Name{getSortIndicator("last_name")}
                  </th>
                  <th
                    onClick={() => handleSort("first_name")}
                    data-testid="header-first_name"
                    style={{ cursor: "pointer" }}
                  >
                    First Name{getSortIndicator("first_name")}
                  </th>
                  <th
                    onClick={() => handleSort("email_address")}
                    data-testid="header-email_address"
                    style={{ cursor: "pointer" }}
                  >
                    Email Address{getSortIndicator("email_address")}
                  </th>
                  <th
                    onClick={() => handleSort("specialty")}
                    data-testid="header-specialty"
                    style={{ cursor: "pointer" }}
                  >
                    Specialty{getSortIndicator("specialty")}
                  </th>
                  <th
                    onClick={() => handleSort("practice_name")}
                    data-testid="header-practice_name"
                    style={{ cursor: "pointer" }}
                  >
                    Practice Name{getSortIndicator("practice_name")}
                  </th>
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
                    <td>{provider.last_name}</td>
                    <td>{provider.first_name}</td>
                    <td>{provider.email_address}</td>
                    <td>{provider.specialty}</td>
                    <td>{provider.practice_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
