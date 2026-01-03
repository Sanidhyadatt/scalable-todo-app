"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, Trash2, Edit2, CheckCircle2, Circle, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/tasks', newTask);
            setTasks([res.data, ...tasks]);
            setIsAdding(false);
            setNewTask({ title: '', description: '', status: 'pending' });
        } catch (err) {
            console.error('Failed to add task');
        }
    };

    const toggleStatus = async (task: Task) => {
        const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
        try {
            const res = await api.patch(`/tasks/${task.id}`, { status: nextStatus });
            setTasks(tasks.map(t => t.id === task.id ? res.data : t));
        } catch (err) {
            console.error('Failed to update task');
        }
    };

    const deleteTask = async (id: string) => {
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (err) {
            console.error('Failed to delete task');
        }
    };

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Tasks</h1>
                    <p className="text-gray-400">Manage and track your daily activities</p>
                </div>
                <Button onClick={() => setIsAdding(true)} className="rounded-full px-6">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Task
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#111111] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                </div>
                <Button variant="outline" className="border-gray-800 text-gray-400">
                    <Filter className="w-5 h-5 mr-2" />
                    Filter
                </Button>
            </div>

            {isAdding && (
                <Card className="border-blue-500/30 bg-blue-500/5 overflow-hidden animate-in zoom-in-95 duration-200">
                    <CardContent className="p-6">
                        <form onSubmit={handleAddTask} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    placeholder="Task title"
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                    className="bg-black/50 border-gray-800"
                                />
                                <select
                                    className="bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    value={newTask.status}
                                    onChange={e => setNewTask({ ...newTask, status: e.target.value as any })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <textarea
                                placeholder="Description (optional)"
                                value={newTask.description}
                                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[80px]"
                            />
                            <div className="flex justify-end space-x-3">
                                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                                <Button type="submit">Create Task</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <div className="text-center py-20 grayscale opacity-50">
                    <div className="animate-pulse space-y-4">
                        <div className="h-20 bg-gray-800 rounded-2xl w-full"></div>
                        <div className="h-20 bg-gray-800 rounded-2xl w-full"></div>
                    </div>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="text-center py-20 bg-[#111111]/50 border border-gray-800 rounded-2xl">
                    <CheckCircle2 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-400">No tasks found</h3>
                    <p className="text-gray-600 mt-1">Start by adding a new task above</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredTasks.map((task) => (
                        <Card key={task.id} className={cn(
                            "group border-gray-800 bg-[#111111]/50 hover:bg-[#111111] transition-all",
                            task.status === 'completed' && "opacity-60"
                        )}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => toggleStatus(task)}
                                        className="flex-shrink-0 transition-transform active:scale-90"
                                    >
                                        {task.status === 'completed' ? (
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-gray-600 hover:text-gray-400" />
                                        )}
                                    </button>
                                    <div>
                                        <h3 className={cn(
                                            "font-semibold text-white",
                                            task.status === 'completed' && "line-through text-gray-500"
                                        )}>
                                            {task.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate max-w-md">{task.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className={cn(
                                        "text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full border",
                                        task.status === 'pending' && "text-amber-500 border-amber-500/30 bg-amber-500/5",
                                        task.status === 'in-progress' && "text-blue-500 border-blue-500/30 bg-blue-500/5",
                                        task.status === 'completed' && "text-emerald-500 border-emerald-500/30 bg-emerald-500/5"
                                    )}>
                                        {task.status}
                                    </span>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-white">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
