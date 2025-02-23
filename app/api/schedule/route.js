import { NextResponse } from "next/server";
import { fcfsScheduling, roundRobinScheduling, sjfScheduling } from "@/utils/algorithms";


export async function POST(req) {
  const { algorithm, processes } = await req.json();

  if (!processes || processes.length === 0) {
    return NextResponse.json({ error: "No processes provided" }, { status: 400 });
  }

  let ganttChart = [];

  switch(algorithm){
    case "fcfs":{
      ganttChart = fcfsScheduling(processes);
      break;
    }
    case "round_robin":{
      ganttChart = roundRobinScheduling(processes);
      break;
    }
    case "sjf":{
      ganttChart = sjfScheduling(processes);
      break;
    }
    default:{
      return NextResponse.json({ error: "Invalid algorithm" }, { status: 400 });
    }
  }
  return NextResponse.json(ganttChart);
  // if (algorithm === "fcfs") {
  //   ganttChart = fcfsScheduling(processes);
  // } else if (algorithm === "round_robin") {
  //   ganttChart = roundRobinScheduling(processes, 2); // Default time quantum = 2
  // } else {
  //   return NextResponse.json({ error: "Invalid algorithm" }, { status: 400 });
  // }

}


