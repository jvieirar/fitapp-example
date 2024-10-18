"use client"

import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from 'ai/react';
import { observer } from "@legendapp/state/react";
import { workouts$ } from '@/lib/legendState';

const Chat = observer(() => {
  const { user } = useUser();
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  const analyzePerformance = async () => {
    const userWorkouts = Object.values(workouts$.get()).filter((workout: any) => workout.user_id === user?.id);
    const analysis = `Based on your recent workouts: ${userWorkouts.map((w: any) => `${w.name} (${w.duration} min)`).join(', ')}. `;
    handleSubmit({ preventDefault: () => {} }, analysis);
  };

  const generateWorkout = async () => {
    handleSubmit({ preventDefault: () => {} }, "Generate a new workout plan for me based on my recent activity and preferences.");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Fitness Assistant</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`p-2 rounded ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {m.content}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything about fitness..."
              />
              <Button type="submit" className="mt-2">Send</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button onClick={analyzePerformance} className="w-full">Analyze My Performance</Button>
              <Button onClick={generateWorkout} className="w-full">Generate New Workout</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default Chat;