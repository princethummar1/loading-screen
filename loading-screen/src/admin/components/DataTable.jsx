import { useState, useMemo } from 'react';
import { FiChevronUp, FiChevronDown, FiTrash2, FiEdit2, FiEye, FiMoreVertical } from 'react-icons/fi';

export default function DataTable({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onView,
  selectable = false,
  onSelectionChange,
  emptyMessage = 'No data available',
  loading = false,
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Handle selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(data.map(item => item._id || item.id));
      setSelectedIds(allIds);
      onSelectionChange?.(Array.from(allIds));
    } else {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      onSelectionChange?.(Array.from(newSet));
      return newSet;
    });
  };

  const isAllSelected = data.length > 0 && selectedIds.size === data.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < data.length;

  if (loading) {
    return (
      <div className="data-table-loading">
        <div className="data-table-spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="data-table-wrapper">
      {/* Bulk Actions Bar */}
      {selectable && selectedIds.size > 0 && (
        <div className="data-table-bulk-bar">
          <span className="bulk-count">{selectedIds.size} selected</span>
          <div className="bulk-actions">
            {onDelete && (
              <button 
                className="bulk-action-btn danger"
                onClick={() => onDelete(Array.from(selectedIds))}
              >
                <FiTrash2 size={14} />
                Delete Selected
              </button>
            )}
          </div>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            {selectable && (
              <th className="data-table-check">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={el => el && (el.indeterminate = isSomeSelected)}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map(col => (
              <th 
                key={col.key}
                className={col.sortable ? 'sortable' : ''}
                onClick={() => col.sortable && handleSort(col.key)}
                style={{ width: col.width }}
              >
                <div className="th-content">
                  {col.label}
                  {col.sortable && sortConfig.key === col.key && (
                    sortConfig.direction === 'asc' 
                      ? <FiChevronUp size={14} />
                      : <FiChevronDown size={14} />
                  )}
                </div>
              </th>
            ))}
            {(onEdit || onDelete || onView) && (
              <th className="data-table-actions">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0) + (onEdit || onDelete || onView ? 1 : 0)}>
                <div className="data-table-empty">{emptyMessage}</div>
              </td>
            </tr>
          ) : (
            sortedData.map(item => {
              const id = item._id || item.id;
              return (
                <tr key={id} className={selectedIds.has(id) ? 'selected' : ''}>
                  {selectable && (
                    <td className="data-table-check">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(id)}
                        onChange={() => handleSelectOne(id)}
                      />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td className="data-table-actions">
                      <div className="action-buttons">
                        {onView && (
                          <button 
                            className="action-btn view"
                            onClick={() => onView(item)}
                            title="View"
                          >
                            <FiEye size={14} />
                          </button>
                        )}
                        {onEdit && (
                          <button 
                            className="action-btn edit"
                            onClick={() => onEdit(item)}
                            title="Edit"
                          >
                            <FiEdit2 size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button 
                            className="action-btn delete"
                            onClick={() => onDelete([id])}
                            title="Delete"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
