import { useState } from 'react';
import RegexInput from './RegexInput';
import type { ProviderData } from '../App';

type SortKey = keyof ProviderData;
type SortDirection = 'asc' | 'desc';

interface ProviderTableProps {
    providers: ProviderData[];
}

export default function ProviderTable({ providers }: ProviderTableProps) {
    const [filter, setFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('last_name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const filteredData = providers.filter(
        (provider) =>
            provider.first_name.toLowerCase().includes(filter.toLowerCase()) ||
            provider.last_name.toLowerCase().includes(filter.toLowerCase()) ||
            provider.email_address.toLowerCase().includes(filter.toLowerCase()) ||
            provider.specialty.toLowerCase().includes(filter.toLowerCase()) ||
            provider.practice_name.toLowerCase().includes(filter.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortKey].toLowerCase();
        const bValue = b[sortKey].toLowerCase();
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const getSortIndicator = (key: SortKey) => {
        if (sortKey !== key) return '';
        return sortDirection === 'asc' ? ' ▲' : ' ▼';
    };

    return (
        <div>
            <h2>Provider Table</h2>
            <RegexInput
                value={filter}
                onChange={setFilter}
                placeholder="Filter by any field"
            />
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('last_name')} data-testid="header-last_name" style={{ cursor: 'pointer' }}>
                            Last Name{getSortIndicator('last_name')}
                        </th>
                        <th onClick={() => handleSort('first_name')} data-testid="header-first_name" style={{ cursor: 'pointer' }}>
                            First Name{getSortIndicator('first_name')}
                        </th>
                        <th onClick={() => handleSort('email_address')} data-testid="header-email_address" style={{ cursor: 'pointer' }}>
                            Email Address{getSortIndicator('email_address')}
                        </th>
                        <th onClick={() => handleSort('specialty')} data-testid="header-specialty" style={{ cursor: 'pointer' }}>
                            Specialty{getSortIndicator('specialty')}
                        </th>
                        <th onClick={() => handleSort('practice_name')} data-testid="header-practice_name" style={{ cursor: 'pointer' }}>
                            Practice Name{getSortIndicator('practice_name')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((provider, idx) => (
                        <tr key={idx}>
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
    );
};
