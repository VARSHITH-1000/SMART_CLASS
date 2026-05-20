import React from 'react';
import { useParams } from 'react-router-dom';
import TeacherLiveView from './TeacherLiveView';
import StudentLiveView from './StudentLiveView';

export default function Classroom() {
  const { id } = useParams();

  // Mock authentication logic. In production, get this from Context.
  const role = "student"; // Change to "student" to test student view
  const studentId = 123;

  return (
    <div className="space-y-6">
      {role === 'teacher' ? (
        <TeacherLiveView classroomId={id} />
      ) : (
        <StudentLiveView classroomId={id} studentId={studentId} />
      )}
    </div>
  );
}
