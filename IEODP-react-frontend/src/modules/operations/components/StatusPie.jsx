import { PieChart } from 'lucide-react'
import React from 'react'
import { Cell, Pie, ResponsiveContainer, Tooltip } from 'recharts'
const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];
const StatusPie = ({ statusData }) => {
  return (
      <>
       <div className="card bg-base-200 p-4 shadow">
                           <h2 className="font-semibold mb-2">Ticket Status Distribution</h2>
                           <ResponsiveContainer width="100%" height={250}>
                               <PieChart>
                                   <Pie
                                       data={statusData}
                                       cx="50%"
                                       cy="50%"
                                       outerRadius={80}
                                       dataKey="value"
                                       label
                                   >
                                       {statusData.map((entry, index) => (
                                           <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                       ))}
                                   </Pie>
                                   <Tooltip />
                               </PieChart>
                           </ResponsiveContainer>
                       </div>   
    </>
  )
}

export default StatusPie