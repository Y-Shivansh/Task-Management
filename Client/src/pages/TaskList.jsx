import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TaskForm } from '../components/TaskForm';

export const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [priorityFilter, setPriorityFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/tasks`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTasks(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setError('Failed to load tasks. Please try again later.');
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleDeleteTask = async (taskId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/v1/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleCompleteTask = async (taskId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/v1/tasks/${taskId}`, {
                status: 'completed'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks(tasks.map(task => task._id === taskId ? { ...task, status: 'completed' } : task));
        } catch (error) {
            console.error('Error marking task as complete:', error);
        }
    };

    const filteredTasks = tasks.filter(task => {
        return (priorityFilter ? task.priority === parseInt(priorityFilter) : true) &&
               (statusFilter ? task.status === statusFilter : true);
    });

    const closeOverlay = () => {
        setShowTaskForm(false);
        setShowUpdateForm(false);
        setSelectedTask(null);
    };

    if (loading) {
        return <div className="text-center text-xl">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Task List</h1>
            <div className="flex justify-between mb-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowTaskForm(!showTaskForm)}
                >
                    {showTaskForm ? 'Close Task Form' : 'Add Task'}
                </button>
                <div>
                    <label for="priority" className="mr-2">Priority:</label>
                    <select id="priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="mr-4 px-5">
                        <option value="">All</option>
                        {[1, 2, 3, 4, 5].map(priority => (
                            <option key={priority} value={priority}>{priority}</option>
                        ))}
                    </select>
                    <label for="status" className="mr-2">Status:</label>
                    <select id="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All</option>
                        {['pending', 'in-progress', 'completed', 'lapsed'].map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>
            {showTaskForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeOverlay}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={closeOverlay}>
                            &times;
                        </button>
                        <TaskForm onClose={closeOverlay} />
                    </div>
                </div>
            )}
            {showUpdateForm && selectedTask && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeOverlay}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-2/5 relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={closeOverlay}>
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">Update Task</h2>
                        <TaskForm task={selectedTask} onClose={closeOverlay} />
                    </div>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-2 px-4 border-b text-center font-bold">Task ID</th>
                            <th className="py-2 px-4 border-b text-center font-bold">Title</th>
                            <th className="py-2 px-4 border-b text-center font-bold">Priority</th>
                            <th className="py-2 px-4 border-b text-center font-bold">Status</th>
                            <th className="py-2 px-4 border-b text-center font-bold">Start Date</th>
                            <th className="py-2 px-4 border-b text-center font-bold">End Date</th>
                            <th className="py-2 px-4 border-b text-center font-bold">Total Time (hours)</th>
                            <th className="py-2 px-4 border-b text-center font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map((task, index) => (
                            <tr key={task._id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-300'}>
                                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                                <td className="py-2 px-4 border-b text-center">{task.title}</td>
                                <td className="py-2 px-4 border-b text-center">{task.priority}</td>
                                <td className="py-2 px-4 border-b text-center">{task.status}</td>
                                <td className="py-2 px-4 border-b text-center">{new Date(task.startDate).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b text-center">{new Date(task.endDate).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b text-center">{((new Date(task.endDate) - new Date(task.startDate)) / (1000 * 60 * 60)).toFixed(2)}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button
                                        className=" hover:bg-gray-800 bg-gray-500 transition duration-200 ease-linear text-white px-2 py-1 rounded-xl mr-2"
                                        onClick={() => {
                                            setSelectedTask(task);
                                            setShowUpdateForm(true);
                                        }}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="bg-teal-500 hover:bg-teal-700 transition duration-200 ease-linear text-white px-2 py-1 mr-2 rounded-xl"
                                        onClick={() => handleCompleteTask(task._id)}
                                    >
                                        Mark Complete
                                    </button>
                                    <button
                                        className="bg-gray-500 hover:bg-gray-800 transition duration-200 ease-linear text-white px-2 py-1 rounded-xl "
                                        onClick={() => handleDeleteTask(task._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};