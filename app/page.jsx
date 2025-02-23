"use client";

import { useState } from "react";

export default function Home() {
  const [algorithm, setAlgorithm] = useState("fcfs");
  const [processes, setProcesses] = useState([]);
  const [newProcess, setNewProcess] = useState({ id: "", burstTime: "", arrivalTime: "" });
  const [ganttChart, setGanttChart] = useState([]);

  // Define colors (cycling through 3 colors)
  const colors = ["bg-blue-500", "bg-green-500", "bg-red-500"];

  const handleAddProcess = () => {
    if (!newProcess.id || !newProcess.burstTime || !newProcess.arrivalTime) return;

    setProcesses([...processes, {
      id: parseInt(newProcess.id),
      burstTime: parseInt(newProcess.burstTime),
      arrivalTime: parseInt(newProcess.arrivalTime),
    }]);

    setNewProcess({ id: "", burstTime: "", arrivalTime: "" });
  };

  const handleDelete=()=>{
    setProcesses([]);
  }

  const handleRunAlgorithm = async () => {
    if (processes.length === 0) return;

    const response = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ algorithm, processes }),
    });

    const result = await response.json();
    setGanttChart(result);
  };

  return (
    <div className="p-4">
      <header className="h-24 w-full fixed top-0 left-0 flex bg-foreground text-background items-center px-4"><span className="text-4xl">schedul</span></header>
      <h1 className="text-3xl mt-32 mb-8 font-bold text-foreground">Visualize CPU scheduling algorithms the easy way.</h1>

      <div className="flex flex-2 gap-16 border rounded-lg p-4">
      <div className="flex flex-col">
        <label className="font-semibold">Algorithm:</label>
        <select onChange={(e) => setAlgorithm(e.target.value)} value={algorithm} className="bg-background text-foreground border-1 border-black rounded-xl px-2 py-1 transition-all">
          <option value="fcfs">FCFS</option>
          <option value="round_robin">Round Robin</option>
        </select>
        <button onClick={handleRunAlgorithm} className="mt-auto bg-blue-500 text-background px-4 py-2 max-h-16 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all">
        Run {algorithm.toUpperCase()}
      </button>
      </div>

      {/* Add Process Form */}
      <div className="border p-4 rounded-lg flex flex-col gap-4">
        <h2 className="font-semibold">Add Process</h2>
        <input
          type="number"
          placeholder="Process ID"
          value={newProcess.id}
          onChange={(e) => setNewProcess({ ...newProcess, id: e.target.value })}
          className="border p-1 mx-1"
        />
        <input
          type="number"
          placeholder="Burst Time"
          value={newProcess.burstTime}
          onChange={(e) => setNewProcess({ ...newProcess, burstTime: e.target.value })}
          className="border p-1 mx-1"
        />
        <input
          type="number"
          placeholder="Arrival Time"
          value={newProcess.arrivalTime}
          onChange={(e) => setNewProcess({ ...newProcess, arrivalTime: e.target.value })}
          className="border p-1 mx-1"
        />
        <button onClick={handleAddProcess} className="bg-green-500 text-white px-3 py-1 ml-2 rounded-lg hover:bg-green-700 hover:scale-105 transition-all">
          Add Process
        </button>
      </div>

      {/* Process List */}
      <div className="ml-auto">
      <h2 className="font-semibold">Processes in Ready Queue</h2>
      <div className="mt-4 overflow-y-auto h-48">

        {processes.length==0 && <span className="text-sm text-gray-500">Add a process...</span>}
        
        {processes.map((p, index) => (
          <div key={index} className="border p-2 mt-1 transition-all overflow-y-auto mr-2">
            P{p.id}: Burst={p.burstTime}, Arrival={p.arrivalTime}
          </div>
        ))}
      </div>
      {processes.length>0 && <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 px-2 py-1 rounded-lg">Clear</button>}
      </div>

      {/* Run Algorithm Button */}
      
        </div>
        
      {/* Gantt Chart Output (Updated Layout) */}
      <div>
      {ganttChart.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold text-xl">Gantt Chart:</h2>
          <hr className="border w-full border-gray-200 mb-4 mt-2"></hr>
          <div className="flex border-t border-b relative bg-gray-200 p-8 rounded-lg">
            {ganttChart.map((item, index) => (
              <div 
                key={index} 
                className={`p-2 flex hover:scale-105 hover:z-50 text-white border-2 border-white transition-all h-24 ${item.processId === -1 ? 'bg-yellow-500' : colors[item.processId % 3]} relative`} 
                style={{ width: `${(item.endTime - item.startTime) * 40}px` }}
              >
                <span className="absolute -top-5 left-0 align-middle text-xs text-foreground">{item.startTime}</span>
                {item.processId === -1 ? 'CPU Idle' : `P${item.processId}`}
                {index === ganttChart.length - 1 && (
                  <span className="absolute -top-5 right-0 text-xs text-foreground">{item.endTime}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
