import React from 'react';

const AnalysisPanel: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">
        Analysis Panel
      </h3>
      <div className="space-y-4">
        <div className="text-center text-gray-600">
          <p className="text-sm">Analysis features coming soon!</p>
          <p className="text-xs mt-2">
            This panel will show ELO-tailored move explanations and coaching insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;