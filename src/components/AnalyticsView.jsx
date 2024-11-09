import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('bar'); // 'bar' or 'pie'

    // Colors for the chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    useEffect(() => {
        fetchCategoryAnalytics();
    }, []);

    const fetchCategoryAnalytics = async () => {
        try {
            const response = await fetch('http://localhost:9090/api/chat-history/chat-logs/category-analytics');
            const data = await response.json();

            // Transform data for charts
            const formattedData = Object.entries(data).map(([category, count]) => ({
                category,
                count: count
            }));

            setCategoryData(formattedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching category analytics:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Question Categories Analysis</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setChartType('bar')}
                        className={`px-3 py-1 rounded ${chartType === 'bar'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        Bar Chart
                    </button>
                    <button
                        onClick={() => setChartType('pie')}
                        className={`px-3 py-1 rounded ${chartType === 'pie'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        Pie Chart
                    </button>
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                {chartType === 'bar' ? (
                    <BarChart
                        width={600}
                        height={400}
                        data={categoryData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Questions Asked" />
                    </BarChart>
                ) : (
                    <PieChart width={800} height={400}>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={160}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="category"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                    //    <PieChart width={800} height={400}>
                    //    <Pie
                    //      data={data}
                    //      cx="50%"
                    //      cy="50%"
                    //      labelLine={false}
                    //      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    //      outerRadius={150}
                    //      fill="#8884d8"
                    //     dataKey="count"
                    //     nameKey="category"
                    //    >
                    //      {data.map((entry, index) => (
                    //        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    //      ))}
                    //    </Pie>
                    //    <Legend />
                    //  </PieChart>
                )}
            </div>

            {/* Summary Table */}
            <div className="mt-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Questions Asked
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Percentage
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categoryData.map((item, index) => {
                            const totalQuestions = categoryData.reduce((sum, curr) => sum + curr.count, 0);
                            const percentage = ((item.count / totalQuestions) * 100).toFixed(1);

                            return (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.count}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {percentage}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}