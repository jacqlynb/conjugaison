import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import './CustomPieChart.css';

export function CustomPieChart(props) {
  const data = [
    { name: 'Group A', value: props.summaryCorrect },
    {
      name: 'Group B',
      value: props.summaryTotalConjugations - props.summaryCorrect,
    },
  ];

  return (
    <PieChart className="custom-pie-chart" width={200} height={200}>
      <text x="50%" y="50%" dy={8} textAnchor="middle">
        {`${props.summaryCorrect}/${props.summaryTotalConjugations}`}
      </text>
      <Pie
        data={data}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={70}
        outerRadius={90}
        startAngle={90}
        endAngle={450}
        fill="#82ca9d"
        labelLine={false}
        label={false}
      >
        <Cell key="correct" fill="#82ca9d" />
        <Cell key="incorrect" fill="#ff8a80" />
      </Pie>
    </PieChart>
  );
}
