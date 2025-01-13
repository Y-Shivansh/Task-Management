import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { InputBox } from './form/InputBox';
import { Button } from './form/Button';
import { Heading } from './form/Heading';

export const TaskForm = ({ task, onClose }) => {
    const navigate = useNavigate();
    const [title, setTitle] = useState(task ? task.title : '');
    const [description, setDescription] = useState(task ? task.description : '');
    const [priority, setPriority] = useState(task ? task.priority : 1);
    const [startDate, setStartDate] = useState(task ? task.startDate : '');
    const [endDate, setEndDate] = useState(task ? task.endDate : '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (task) {
                // Update task
                await axios.put(`${import.meta.env.VITE_API_URL}/v1/tasks/${task._id}`, {
                    title,
                    description,
                    priority,
                    startDate,
                    endDate,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                onClose();
            } else {
                // Create new task
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/tasks`, {
                    title,
                    description,
                    priority,
                    startDate,
                    endDate,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 201) {
                    navigate('/tasks');
                }
            }
        } catch (error) {
            console.error('Error submitting task:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <Heading label={task ? "Update Task" : "Create Task"} />
            <form onSubmit={handleSubmit}>
                <InputBox
                    label="Title"
                    placeholder="Task Title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <InputBox
                    label="Description"
                    placeholder="Task Description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <InputBox
                    label="Priority"
                    placeholder="1"
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                />
                <InputBox
                    label="Start Date"
                    placeholder="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <InputBox
                    label="End Date"
                    placeholder="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <div className="pt-4">
                    <Button label={task ? "Update Task" : "Create Task"} onClick={handleSubmit} type="submit" />
                </div>
            </form>
        </div>
    );
};