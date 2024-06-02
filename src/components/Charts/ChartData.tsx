interface IChartData {
  [key: string]: {
    month: string;
    todo: number;
    inprogress: number;
    done: number;
    verified: number;
  };
}


function isStatusKey(key: string): key is 'todo' | 'inprogress' | 'done' | 'verified' {
  return ['todo', 'inprogress', 'done', 'verified'].includes(key);
}

export function mapTasksToChartData(tasks: any[]) {

  // Initialize an empty object for each month
  const chartData: IChartData = {
    Jan: { month: 'Jan', todo: 0, inprogress: 0, done: 0, verified: 0 },
    Feb: { month: 'Feb', todo: 0, inprogress: 0, done: 0, verified: 0 },
    Mar: { month: 'Mar', todo: 0, inprogress: 0, done: 0, verified: 0 },
    Apr: { month: 'Apr', todo: 0, inprogress: 0, done: 0, verified: 0 },
    May: { month: 'May', todo: 0, inprogress: 0, done: 0, verified: 0 },
    Jun: { month: 'Jun', todo: 0, inprogress: 0, done: 0, verified: 0 },
    Jul: { month: 'Jul', todo: 0, inprogress: 0, done: 0, verified: 0 },
    Aug: { month: 'Aug', todo: 0, inprogress: 0, done: 0, verified: 0 },
    Sep: { month: 'Sep', todo: 0, inprogress: 0, done: 0, verified: 0 },
    Oct: { month: 'Oct', todo: 0, inprogress: 0, done: 0, verified: 0 },
    Nov: { month: 'Nov', todo: 0, inprogress: 0, done: 0, verified: 0 },
    Dec: { month: 'Dec', todo: 0, inprogress: 0, done: 0, verified: 0 },
  };

  // Then in your loop:
  for (let task of tasks) {
    const month = new Date(task.updatedAt).toLocaleString('en-US', { month: 'short' }).charAt(0).toUpperCase() + new Date(task.updatedAt).toLocaleString('en-US', { month: 'short' }).slice(1);
    const statusKey = task.status;

    if (chartData[month] && isStatusKey(statusKey)) {
      chartData[month][statusKey as 'todo' | 'inprogress' | 'done' | 'verified']++;

      // If the task is verified, also increment the 'done' count
      if (statusKey === 'verified') {
        chartData[month]['done']++;
      }
    }
  }

  return Object.values(chartData);
}



// export function mapTasksToChartData(tasks: any[]) {

//   // Initialize an empty object for each month
//   const chartData: IChartData = {
//     Jan: { name: 'Jan', todo: 0, inprogress: 0, done: 0, verified: 0 },
//     Feb: { name: 'Feb', todo: 0, inprogress: 0, done: 0, verified: 0 },
//     Mar: { name: 'Mar', todo: 0, inprogress: 0, done: 0, verified: 0 },
//     Apr: { name: 'Apr', todo: 0, inprogress: 0, done: 0, verified: 0 },
//     May: { name: 'May', todo: 0, inprogress: 0, done: 0, verified: 0 },
//     Jun: { name: 'Jun', todo: 0, inprogress: 0, done: 0, verified: 0 },
//     Jul: { name: 'Jul', todo: 0, inprogress: 0, done: 0, verified: 0 },
//     Aug: { name: 'Aug', todo: 0, inprogress: 0, done: 0, verified: 0 },
//     Sep: { name: 'Sep', todo: 0, inprogress: 0, done: 0, verified: 0 },
//     Oct: { name: 'Oct', todo: 0, inprogress: 0, done: 0, verified: 0 },
//     Nov: { name: 'Nov', todo: 0, inprogress: 0, done: 0, verified: 0 },
//     Dec: { name: 'Dec', todo: 0, inprogress: 0, done: 0, verified: 0 },
//   };

//   // Then in your loop:
//   for (let task of tasks) {
//     const month = new Date(task.createdAt).toLocaleString('en-US', { month: 'short' }).charAt(0).toUpperCase() + new Date(task.createdAt).toLocaleString('en-US', { month: 'short' }).slice(1);
//     const statusKey = task.status;

//     if (chartData[month] && isStatusKey(statusKey)) {
//       chartData[month][statusKey as 'todo' | 'inprogress' | 'done' | 'verified']++;
//     }
//   }

//   return Object.values(chartData);
// }

