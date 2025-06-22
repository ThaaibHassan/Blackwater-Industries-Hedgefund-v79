import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TasksPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks & Workflows</h1>
          <p className="text-muted-foreground">
            Manage tasks and workflow processes
          </p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>Assigned tasks and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <AlertCircle className="h-4 w-4 text-warning" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Review TSLA Research</div>
                  <div className="text-xs text-muted-foreground">Due: Today</div>
                </div>
                <Button variant="outline" size="sm">Complete</Button>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Portfolio Rebalance</div>
                  <div className="text-xs text-muted-foreground">Due: Tomorrow</div>
                </div>
                <Button variant="outline" size="sm">Start</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Status</CardTitle>
            <CardDescription>Active workflow processes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <CheckCircle className="h-4 w-4 text-success" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Trade Approval</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Clock className="h-4 w-4 text-warning" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Research Review</div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TasksPage; 