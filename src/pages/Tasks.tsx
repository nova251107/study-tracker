import { useState } from 'react';
import { useGlobalContext } from '../context/useGlobalContext';
import { CheckCircle2, Circle, Trash2, Calendar, Plus } from 'lucide-react';
import './Tasks.css';

const Tasks = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useGlobalContext();
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && deadline) {
      addTask({ title, deadline });
      setTitle('');
      setDeadline('');
    }
  };

  return (
    <div className="tasks-page">
      <header className="page-header">
        <div>
          <h1>Task System</h1>
          <p>Add goals, set deadlines, and track your completed tasks.</p>
        </div>
      </header>

      <div className="tasks-container grid-2">
        <div className="glass-card add-task-card">
          <h2>Add New Goal</h2>
          <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
              <label>Task Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g., Finish React Course"
                required
              />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input 
                type="date" 
                value={deadline} 
                onChange={(e) => setDeadline(e.target.value)} 
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <Plus size={18} />
              Add Task
            </button>
          </form>
        </div>

        <div className="glass-card task-list-card">
          <h2>Your Tasks</h2>
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks added yet. Start by adding a goal!</p>
          ) : (
            <ul className="task-list">
              {tasks.map(task => {
                const isOverdue = !task.completed && new Date(task.deadline) < new Date();
                return (
                  <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
                    <button className="check-btn" onClick={() => toggleTask(task.id)}>
                      {task.completed ? <CheckCircle2 className="checked-icon" size={24} /> : <Circle className="unchecked-icon" size={24} />}
                    </button>
                    <div className="task-info">
                      <h3 className={task.completed ? 'strike' : ''}>{task.title}</h3>
                      <p className={`task-deadline ${isOverdue ? 'overdue-text' : ''}`}>
                        <Calendar size={14} />
                        {new Date(task.deadline).toLocaleDateString()}
                        {isOverdue && ' (Overdue!)'}
                      </p>
                    </div>
                    <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                      <Trash2 size={18} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
