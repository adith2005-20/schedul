// First Come First Serve (FCFS) Scheduling Algorithm with idle times
export function fcfsScheduling(processes) {
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
  export function roundRobinScheduling(processes, quantum) {
    // Create a deep copy of processes to avoid modifying the original array
    let remainingProcesses = processes.map(p => ({ ...p }));
    let queue = [];
    let time = 0;
    let result = [];
  
    // Sort processes by arrival time initially to handle them in order
    remainingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    while (remainingProcesses.length > 0 || queue.length > 0) {
      // Add all processes that have arrived by the current time to the queue
      while (remainingProcesses.length > 0 && remainingProcesses[0].arrivalTime <= time) {
        queue.push(remainingProcesses.shift());
      }
  
      // If queue is empty but there are still processes yet to arrive, CPU is idle
      if (queue.length === 0 && remainingProcesses.length > 0) {
        const nextArrival = remainingProcesses[0].arrivalTime;
        result.push({ processId: -1, startTime: time, endTime: nextArrival });
        time = nextArrival;
        continue;
      }
  
      // Process the first process in the queue
      let process = queue.shift();
      let startTime = time;
      let execTime = Math.min(process.burstTime, quantum);
      let endTime = startTime + execTime;
  
      // Add the execution to the result (Gantt chart)
      result.push({ processId: process.id, startTime, endTime });
  
      // Update process burst time and current time
      process.burstTime -= execTime;
      time = endTime;
  
      // Add any new processes that arrived during this execution
      while (remainingProcesses.length > 0 && remainingProcesses[0].arrivalTime <= time) {
        queue.push(remainingProcesses.shift());
      }
  
      // If the process hasn’t finished, re-enqueue it
      if (process.burstTime > 0) {
        queue.push(process);
      }
    }
  
    return result;
  }
  export function sjfScheduling(processes) {
    let availableProcesses = [];
    let completedProcesses = [];
    let time = 0;
    let result = [];
  
    // Function to find the shortest job among the available processes
    const findShortestJob = () => {
      let shortestJob = null;
      let shortestBurstTime = Infinity;
  
      for (let i = 0; i < availableProcesses.length; i++) {
        if (availableProcesses[i].burstTime < shortestBurstTime) {
          shortestBurstTime = availableProcesses[i].burstTime;
          shortestJob = availableProcesses[i];
        }
      }
      return shortestJob;
    };
  
  
    while (completedProcesses.length < processes.length) {
      // Add processes that have arrived to the available processes list
      for (const process of processes) {
        if (process.arrivalTime <= time && !availableProcesses.includes(process) && !completedProcesses.includes(process)) {
          availableProcesses.push(process);
        }
      }
  
  
      if (availableProcesses.length === 0) {
        // CPU is idle
        let nextArrival = Infinity;
          for(const process of processes){
            if(!completedProcesses.includes(process)){
              nextArrival = Math.min(nextArrival, process.arrivalTime)
            }
          }
  
          if(nextArrival === Infinity) break; //All processes are done
  
        result.push({ processId: -1, startTime: time, endTime: nextArrival });
        time = nextArrival;
  
         // Add processes that have arrived to the available processes list after idle time
         for (const process of processes) {
          if (process.arrivalTime <= time && !availableProcesses.includes(process) && !completedProcesses.includes(process)) {
            availableProcesses.push(process);
          }
        }
      } else {
        // Find the shortest job among the available processes
        const shortestJob = findShortestJob();
  
        if (!shortestJob) {
          // Should not happen, but just in case
          break;
        }
  
  
        // Execute the shortest job
        let startTime = time;
        let endTime = startTime + shortestJob.burstTime;
  
        result.push({ processId: shortestJob.id, startTime, endTime });
        time = endTime;
  
        // Remove the completed process from the available processes list and add it to the completed processes list
        availableProcesses = availableProcesses.filter((process) => process !== shortestJob);
        completedProcesses.push(shortestJob);
  
      }
    }
  
    return result;
  }