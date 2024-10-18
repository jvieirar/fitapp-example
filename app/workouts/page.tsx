"use client"

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { observer } from "@legendapp/state/react";
import { workouts$, addWorkout, updateWorkout, deleteWorkout } from '@/lib/legendState';

const Workouts = observer(() => {
  const { user } = useUser();
  const [newWorkout, setNewWorkout] = useState({ name: '', duration: '' });

  const handleAddWorkout = () => {
    if (user && newWorkout.name && newWorkout.duration) {
      addWorkout(user.id, newWorkout.name, parseInt(newWorkout.duration));
      setNewWorkout({ name: '', duration: '' });
    }
  };

  const handleUpdateWorkout = (id: string, name: string, duration: number) => {
    updateWorkout(id, name, duration);
  };

  const handleDeleteWorkout = (id: string) => {
    deleteWorkout(id);
  };

  const userWorkouts = Object.values(workouts$.get()).filter((workout: any) => workout.user_id === user?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Workouts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleAddWorkout(); }} className="space-y-4">
              <Input
                placeholder="Workout Name"
                value={newWorkout.name}
                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Duration (minutes)"
                value={newWorkout.duration}
                onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
              />
              <Button type="submit">Add Workout</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {userWorkouts.map((workout: any) => (
                <li key={workout.id} className="flex justify-between items-center">
                  <span>{workout.name} - {workout.duration} minutes</span>
                  <div>
                    <Button onClick={() => handleUpdateWorkout(workout.id, workout.name, workout.duration + 5)} className="mr-2">+5 min</Button>
                    <Button onClick={() => handleDeleteWorkout(workout.id)} variant="destructive">Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default Workouts;