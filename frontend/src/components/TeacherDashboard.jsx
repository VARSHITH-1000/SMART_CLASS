import React from 'react';
import { Card, Button } from './ui';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Welcome back, Professor</h2>
          <p className="text-slate-400 mt-2">Manage your classrooms and monitor active sessions.</p>
        </div>
        <Button variant="primary">Create Classroom</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-xl font-semibold mb-4">CS 101: Intro to AI</h3>
          <p className="text-sm text-slate-400 mb-4">Code: <span className="font-mono text-emerald-400">AI101XYZ</span></p>
          <div className="flex space-x-4">
            <Link to="/classroom/1">
              <Button variant="primary">Start Session</Button>
            </Link>
            <Button variant="secondary">View Stats</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
