import React from 'react';
import { ReportsProvider } from '../context/reports/ReportsContext';
import { ReportsDashboard } from '../components/reports/ReportsDashboard';

export function Reports() {
  return (
    <ReportsProvider>
      <ReportsDashboard />
    </ReportsProvider>
  );
}