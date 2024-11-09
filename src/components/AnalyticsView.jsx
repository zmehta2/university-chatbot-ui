import React from 'react';

const AnalyticsView = ({ popularQuestions }) => {
  if (!popularQuestions || typeof popularQuestions !== 'object') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Popular Questions</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const sortedQuestions = Object.entries(popularQuestions)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Popular Questions</h2>
      <div className="space-y-4">
        {sortedQuestions.length > 0 ? (
          sortedQuestions.map(([question, count]) => (
            <div key={question} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>{question}</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {count} times
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No questions available</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsView;