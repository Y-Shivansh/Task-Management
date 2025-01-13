import { useState, useEffect } from 'react';
import axios from 'axios';
import { TaskStatistics } from '../components/TaskStatistics';

const Dashboard = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const handleUpdatePassword = async (newPassword) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/v1/auth/update-password`, {
                password: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            window.location.reload();
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/tasks/metrics`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSummary(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching summary:', error);
                setError('Failed to load summary. Please try again later.');
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return <div className="text-center text-xl">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    // const totalTasks = Object.values(summary.priorityWiseStats).reduce((acc, stat) => acc + stat.pendingTasks, 0);
    const totalTasks = summary.totalTasks;
    const completedTasks = totalTasks - Object.values(summary.priorityWiseStats).reduce((acc, stat) => acc + stat.pendingTasks, 0);
    const completedPercent = ((completedTasks / totalTasks) * 100).toFixed(2);
    const pendingPercent = ((totalTasks - completedTasks) / totalTasks * 100).toFixed(2);
    const avgTimePerCompletedTask = summary.avgTime.toFixed(2);

    const totalPendingTasks = Object.values(summary.priorityWiseStats).reduce((acc, stat) => acc + stat.pendingTasks, 0);
    const totalTimeLapsed = Object.values(summary.priorityWiseStats).reduce((acc, stat) => acc + stat.timeLapsed, 0).toFixed(2);
    const totalTimeToFinish = Object.values(summary.priorityWiseStats).reduce((acc, stat) => acc + stat.timeToFinish, 0).toFixed(2);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="flex justify-between mb-4">
                <div className="relative">
                    <button
                        className="bg-gray-500 transition duration-200 ease-linear text-white px-5 py-1 rounded-full hover:bg-gray-700"
                        onClick={toggleMenu}
                    >
                        Profile
                    </button>
                    {isMenuVisible && (
                        <div className="absolute left-0 mt-2 w-48 text-center bg-gray-100 border rounded shadow-lg">
                            <button
                                className="block w-full text-center px-4 py-2 hover:bg-gray-700 hover:text-white rounded transition duration-300 ease-in-out"
                                onClick={() => {
                                    const newPassword = prompt('Enter new password:');
                                    if (newPassword) handleUpdatePassword(newPassword);
                                }}
                            >
                                Update Password
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* Summary */}
            <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Summary</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>Total Tasks: {totalTasks}</div>
                    <div>Completed Tasks: {completedPercent}%</div>
                    <div>Pending Tasks: {pendingPercent}%</div>
                    <div>Average Time per Completed Task: {avgTimePerCompletedTask} hrs</div>
                </div>
            </div>
            {/* Pending Task Summary */}
            <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Pending Task Summary</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>Pending Tasks: {totalPendingTasks}</div>
                    <div>Total Time Lapsed: {totalTimeLapsed} hrs</div>
                    <div>Total Time to Finish: {totalTimeToFinish} hrs</div>
                </div>
            </div>
            {/* Display task metrics */}
            <TaskStatistics />
        </div>
    );
};

export default Dashboard;