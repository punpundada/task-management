import DashboardCalander from "./calander/dashboard_calander"
import { DatePickerWithRange } from "./DateRange"
import DoneTasksBarChart from "./DoneTasksBarChart"
import TasksPieChart from "./TasksPieChart"

const Dashboard = () => {
  return (
    <div className="w-full h-full space-y-6">
        <div className="flex gap-4">
          <span className="text-2xl font-bold">Dashboard</span>
            <DatePickerWithRange />
        </div>
        <div className="w-full h-1/2 grid grid-cols-1 md:grid-cols-[.35fr_.75fr] gap-8">
          <div className="flex justify-center items-center">
            <TasksPieChart />
          </div>
          <div>
            <DashboardCalander />
          </div>
        </div>
        <div className="w-full h-1/2 grid grid-cols-1 md:grid-cols-[.75fr_.53fr] gap-8">
          <div>
            priority
          </div>
          <div>
            <DoneTasksBarChart />
          </div>
        </div>
    </div>
  )
}

export default Dashboard
