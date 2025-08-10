import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

function AdminPanel() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [username, setUsername] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('desc'); // asc/desc

  const fetchLogs = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/admin/logs', {
        params: {
          page: p,
          limit,
          username: username || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          sort
        }
      });

      setLogs(res.data.logs || []);
      setPage(res.data.page || p);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('fetchLogs error', err);
    } finally {
      setLoading(false);
    }
  }, [username, startDate, endDate, limit, sort]);

  // debounced search to avoid flooding server
  // use lodash.debounce; if not available, you can implement your own
  const debouncedFetch = useCallback(debounce((p) => fetchLogs(p), 500), [fetchLogs]);

  useEffect(() => {
    debouncedFetch(1);
    return () => debouncedFetch.cancel();
  }, [username, startDate, endDate, sort, debouncedFetch]);

  const handlePageClick = (p) => {
    fetchLogs(p);
  };

  const handleExport = () => {
    const params = new URLSearchParams({
      username: username || '',
      startDate: startDate || '',
      endDate: endDate || ''
    });
    // open in new window so browser downloads CSV
    window.open(`http://localhost:5000/api/admin/logs/export?${params.toString()}`, '_blank');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel - Document Logs</h2>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Search username..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <label className="text-sm text-gray-600">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-md border-gray-300"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
            <button
              onClick={() => { setUsername(''); setStartDate(''); setEndDate(''); }}
              className="ml-auto text-sm text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">File</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="p-6 text-center">Loading...</td></tr>
              ) : logs.length ? (
                logs.map((log, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{log.username}</td>
                    <td className="px-6 py-4">{log.action}</td>
                    <td className="px-6 py-4">{log.filename || '-'}</td>
                    <td className="px-6 py-4">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="p-6 text-center text-gray-500">No logs found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageClick(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded-md border ${page === 1 ? 'text-gray-400 border-gray-200' : 'hover:bg-gray-100'}`}
            >
              Prev
            </button>

            {/* simple numeric pagination (shows up to 7 pages window) */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const showWindow = 7;
              const start = Math.max(1, page - Math.floor(showWindow / 2));
              const end = Math.min(totalPages, start + showWindow - 1);
              if (pageNum < start || pageNum > end) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageClick(pageNum)}
                  className={`px-3 py-1 rounded-md border ${pageNum === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageClick(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-md border ${page === totalPages ? 'text-gray-400 border-gray-200' : 'hover:bg-gray-100'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );

 
}

export default AdminPanel;
