import { useEffect, useState } from 'react';
import axios from 'axios';

export const TaskStatistics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/tasks/metrics`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setStats(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching task statistics:', error);
                setError('Failed to load statistics. Please try again later.');
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-center text-xl">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Task Statistics</h1>
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Priority-wise Stats</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-2 px-4 border-b text-center font-bold">Priority</th>
                                <th className="py-2 px-4 border-b text-center font-bold">Pending Tasks</th>
                                <th className="py-2 px-4 border-b text-center font-bold">Time Lapsed (hours)</th>
                                <th className="py-2 px-4 border-b text-center font-bold">Time to Finish (hours)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(stats.priorityWiseStats).map((priority, index) => (
                                <tr key={priority} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                                    <td className="py-2 px-4 border-b text-center">{priority}</td>
                                    <td className="py-2 px-4 border-b text-center">{stats.priorityWiseStats[priority].pendingTasks}</td>
                                    <td className="py-2 px-4 border-b text-center">{stats.priorityWiseStats[priority].timeLapsed.toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b text-center">{stats.priorityWiseStats[priority].timeToFinish.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Average Completion Time</h2>
                <p className="text-center">{stats.avgTime.toFixed(2)} hours</p>
            </div>
        </div>
    );
};