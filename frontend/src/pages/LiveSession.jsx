import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { TeacherLiveView } from './TeacherLiveView';
import { StudentLiveView } from './StudentLiveView';

export default function LiveSession() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  // In a real app, role is derived from a JWT or auth context
  // Here we use URL params for easy testing
  const role = searchParams.get('role') || 'student';
  const studentId = parseInt(searchParams.get('studentId') || '123');

  return (
    <div className="h-[calc(100vh-8rem)]">
      {role === 'teacher' ? (
        <TeacherLiveView classroomId={id} />
      ) : (
        <StudentLiveView classroomId={id} studentId={studentId} />
      )}
    </div>
  );
}
