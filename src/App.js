import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import './App.css';

function App() {
  const [lists, setLists] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const addTask = (task, listName) => {
    setLists((prevLists) => ({
      ...prevLists,
      [listName]: [...prevLists[listName], task],
    }));
  };

  const updateTask = (task, listName) => {
    setLists((prevLists) => {
      const newList = prevLists[listName].map((t) => {
        if (t.id === task.id) {
          return task;
        }
        return t;
      });

      return { ...prevLists, [listName]: newList };
    });
  };

  const moveTask = (taskId, sourceList, destinationList) => {
    setLists((prevLists) => {
      if (
        !prevLists ||
        !prevLists[sourceList] ||
        !prevLists[destinationList] ||
        sourceList === destinationList
      ) {
        console.error('Invalid lists object or list names.');
        return prevLists; // Return the previous state to avoid breaking the state update
      }

      const taskToMove = prevLists[sourceList].find((task) => task.id === taskId);

      if (!taskToMove) {
        console.error('Task not found in the source list.');
        return prevLists; // Return the previous state to avoid breaking the state update
      }

      const updatedLists = {
        ...prevLists,
        [sourceList]: prevLists[sourceList].filter((task) => task.id !== taskId),
        [destinationList]: [...prevLists[destinationList], { ...taskToMove, status: destinationList }],
      };

      return updatedLists;
    });
  };

  const deleteTask = (taskId, listName) => {
    setLists((prevLists) => {
      if (!prevLists || !prevLists[listName]) {
        console.error('Invalid lists object or list name.');
        return prevLists; // Return the previous state to avoid breaking the state update
      }

      const updatedList = prevLists[listName].filter((task) => task.id !== taskId);
      const updatedLists = { ...prevLists, [listName]: updatedList };

      return updatedLists;
    });
  };

  const exportToExcel = () => {
    const csvData = lists.todo.concat(lists.inProgress, lists.done);
    const csvHeaders = [
      { label: 'ID', key: 'id' },
      { label: 'Title', key: 'title' },
      { label: 'Description', key: 'description' },
      { label: 'Status', key: 'status' },
    ];
    const csvReport = {
      data: csvData,
      headers: csvHeaders,
    };
    return csvReport;
  };

  return (
    <div className="App">
      <h1>Task Management App</h1>
      <AddTaskForm addTask={addTask} />
      <TaskList
        title="To Do"
        tasks={lists.todo}
        updateTask={updateTask}
        deleteTask={deleteTask}
        moveTask={(taskId) => moveTask(taskId, 'todo', 'inProgress')}
        exportToExcel={exportToExcel}
      />
      <TaskList
        title="In Progress"
        tasks={lists.inProgress}
        updateTask={updateTask}
        deleteTask={deleteTask}
        moveTask={(taskId) => moveTask(taskId, 'inProgress', 'done')}
        exportToExcel={exportToExcel}
      />
      <TaskList
        title="Done"
        tasks={lists.done}
        updateTask={updateTask}
        deleteTask={deleteTask}
        moveTask={(taskId) => moveTask(taskId, 'done', 'todo')}
        exportToExcel={exportToExcel}
      />
      <button
        onClick={() => {
          const csvReport = exportToExcel();
          const { data, headers } = csvReport;
          const jsonData = data.map((row) => headers.map((header) => row[header.key]));
          const csvString = [headers.map((header) => header.label), ...jsonData].join('\n');
          const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.setAttribute('href', url);
          link.setAttribute('download', 'task_list.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
      >
        Export to Excel
      </button>
    </div>
  );
}

export default App;
