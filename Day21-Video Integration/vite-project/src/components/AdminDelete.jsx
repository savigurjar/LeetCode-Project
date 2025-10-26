import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;

    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const query = searchQuery.toLowerCase();

    return (
      problem.title.toLowerCase().includes(query) ||
      problem._id.toLowerCase().includes(query) ||
      problem.difficulty.toLowerCase().includes(query) ||
      (Array.isArray(problem.tags)
        ? problem.tags.join(', ').toLowerCase().includes(query)
        : problem.tags?.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Delete Problems</h1>
        <input
          type="text"
          placeholder="Search by title, ID, difficulty, or tags..."
          className="input input-bordered w-full sm:max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Problems Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="w-1/12">#</th>
              <th className="w-4/12">Title</th>
              <th className="w-2/12">Difficulty</th>
              <th className="w-3/12">Tags</th>
              <th className="w-2/12">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem, index) => (
                <tr key={problem._id}>
                  <th>{index + 1}</th>
                  <td>{problem.title}</td>
                  <td>
                    <span className={`badge ${
                      problem.difficulty === 'Easy'
                        ? 'badge-success'
                        : problem.difficulty === 'Medium'
                          ? 'badge-warning'
                          : 'badge-error'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-outline">
                      {Array.isArray(problem.tags)
                        ? problem.tags.join(', ')
                        : problem.tags}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No matching problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDelete;
