import { NextResponse } from "next/server";

export async function POST(req) {
  const { algorithm, processes } = await req.json();

  if (!processes || processes.length === 0) {
    return NextResponse.json({ error: "No processes provided" }, { status: 400 });
  }

  let ganttChart = [];

  if (algorithm === "fcfs") {
    ganttChart = fcfsScheduling(processes);
  } else if (algorithm === "round_robin") {
    ganttChart = roundRobinScheduling(processes, 2); // Default time quantum = 2
  } else {
    return NextResponse.json({ error: "Invalid algorithm" }, { status: 400 });
  }

  return NextResponse.json(ganttChart);
}

// First Come First Serve (FCFS) Scheduling Algorithm with idle times
function fcfsScheduling(processes) {
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  let time = 0;
  let result = [];

  for (const process of processes) {
    if (time < process.arrivalTime) {
      result.push({ processId: -1, startTime: time, endTime: process.arrivalTime }); // CPU idle
      time = process.arrivalTime;
    }

    let startTime = time;
    let endTime = startTime + process.burstTime;
    result.push({ processId: process.id, startTime, endTime });
    time = endTime;
  }

  return result;
}

// Round Robin Scheduling Algorithm with idle times
function roundRobinScheduling(processes, quantum) {
  let queue = [...processes];
  let time = 0;
  let result = [];

  while (queue.length > 0) {
    let process = queue.shift();
    if (!process) continue;

    if (time < process.arrivalTime) {
      result.push({ processId: -1, startTime: time, endTime: process.arrivalTime }); // CPU idle
      time = process.arrivalTime;
    }

    let startTime = time;
    let execTime = Math.min(process.burstTime, quantum);
    let endTime = startTime + execTime;

    result.push({ processId: process.id, startTime, endTime });

    process.burstTime -= execTime;
    time = endTime;

    if (process.burstTime > 0) {
      queue.push(process);
    }
  }

  return result;
}
