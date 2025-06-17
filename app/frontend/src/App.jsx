import React from 'react';
import CrimeBarChart from './components/CrimeBarChart';
import TimeHeatmap from './components/TimeHeatmap';
import ReportingDelayChart from './components/ReportingDelayChart';

function App() {
  return (
    <main className="p-4 max-w-screen-xl mx-auto">
      <CrimeBarChart />
      <TimeHeatmap />
      <ReportingDelayChart />
    </main>
  );
}

export default App;