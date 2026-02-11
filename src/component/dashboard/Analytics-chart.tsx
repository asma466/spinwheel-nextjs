// 'use client';

// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// interface AnalyticsChartProps {
//   data: Array<{
//     date: string;
//     events: number;
//     total_value: number;
//   }>;
// }

// export function AnalyticsChart({ data }: AnalyticsChartProps) {
//   const chartData = data
//     .reverse()
//     .map((item) => ({
//       date: new Date(item.date).toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//       }),
//       events: item.events,
//       value: item.total_value || 0,
//     }));

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Analytics Overview</CardTitle>
//         <CardDescription>Daily events and value over the last 30 days</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="events"
//               stroke="hsl(var(--color-primary))"
//               strokeWidth={2}
//               dot={{ r: 4 }}
//             />
//             <Line
//               type="monotone"
//               dataKey="value"
//               stroke="hsl(var(--color-accent))"
//               strokeWidth={2}
//               dot={{ r: 4 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// }
