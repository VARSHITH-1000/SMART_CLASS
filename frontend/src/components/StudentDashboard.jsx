import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const [joinCode, setJoinCode] = useState('');

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Student Portal</h2>
        <p className="text-slate-400 mt-2">Join a classroom or view your attention analytics.</p>
      </div>

      <Card className="flex flex-col items-center p-8">
        <h3 className="text-2xl font-semibold mb-6">Join a Classroom</h3>
        <Input
          type="text"
          placeholder="Enter 8-digit Code"
          className="w-64 text-center font-mono text-xl mb-6"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
        />
        <Button variant="primary" className="w-64" disabled={joinCode.length < 5}>
          Join Classroom
        </Button>
      </Card>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">Your Active Classes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h4 className="text-lg font-medium">CS 101: Intro to AI</h4>
            <p className="text-emerald-400 text-sm mt-1 mb-4">● Session Active</p>
            <Link to="/classroom/1">
              <Button variant="primary" className="w-full">Join Live Session</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
