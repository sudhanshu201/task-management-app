import React from 'react';

const TaskList = ({ title, tasks, updateTask, deleteTask, moveTask }) => {
  return (
    <div className="task-list">
      <h2>{title}</h2>
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <select
            value={task.status}
            onChange={(e) => updateTask({ ...task, status: e.target.value }, title)}
          >
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button onClick={() => deleteTask(task.id, title)}>Delete</button>
          {title !== 'Done' && (
            <button
              onClick={() =>
                moveTask(task.id, title, title === 'To Do' ? 'inProgress' : 'done')
              }
            >
              {title === 'To Do' ? 'Start' : 'Complete'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
