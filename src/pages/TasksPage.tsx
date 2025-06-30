import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, CheckCircle, Clock, AlertCircle, Plus, Edit, Trash2, X, Save } from 'lucide-react';

const TasksPage = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Review TSLA Research',
      description: 'Review and approve the latest Tesla research report',
      status: 'pending' as const,
      priority: 'high' as const,
      assignee: 'John Smith',
      dueDate: '2024-01-15',
      category: 'research' as const
    },
    {
      id: 2,
      title: 'Portfolio Rebalance',
      description: 'Execute portfolio rebalancing trades',
      status: 'in_progress' as const,
      priority: 'medium' as const,
      assignee: 'Sarah Johnson',
      dueDate: '2024-01-16',
      category: 'trading' as const
    }
  ]);

  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      title: 'Trade Approval',
      status: 'completed' as const,
      assignee: 'Mike Chen',
      completedAt: '2024-01-14T10:30:00Z'
    },
    {
      id: 2,
      title: 'Research Review',
      status: 'in_progress' as const,
      assignee: 'Lisa Wang',
      startedAt: '2024-01-13T14:00:00Z'
    }
  ]);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    assignee: '',
    dueDate: '',
    category: 'general' as const
  });
  const { toast } = useToast();

  const handleNewTask = () => {
    console.log('handleNewTask called'); // Debug log
    setIsAddingTask(true);
    setEditingTaskId(null);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      category: 'general'
    });
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.description && newTask.assignee && newTask.dueDate) {
      const task = {
        id: Date.now(),
        ...newTask,
        status: 'pending' as const
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        assignee: '',
        dueDate: '',
        category: 'general'
      });
      setIsAddingTask(false);
      toast({
        title: "Task Added",
        description: "New task has been created successfully.",
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  const handleEditTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setNewTask({
        title: task.title,
        description: task.description,
        priority: task.priority,
        assignee: task.assignee,
        dueDate: task.dueDate,
        category: task.category
      });
      setEditingTaskId(taskId);
      setIsAddingTask(true);
    }
  };

  const handleUpdateTask = () => {
    if (editingTaskId && newTask.title && newTask.description && newTask.assignee && newTask.dueDate) {
      setTasks(tasks.map(task => 
        task.id === editingTaskId 
          ? { ...task, ...newTask }
          : task
      ));
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        assignee: '',
        dueDate: '',
        category: 'general'
      });
      setIsAddingTask(false);
      setEditingTaskId(null);
      toast({
        title: "Task Updated",
        description: "Task has been updated successfully.",
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  const handleCancelForm = () => {
    setIsAddingTask(false);
    setEditingTaskId(null);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      category: 'general'
    });
  };

  const handleCompleteTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'completed' } : task
    ));
    toast({
      title: "Task Completed",
      description: "Task has been marked as completed.",
    });
  };

  const handleStartTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'in_progress' } : task
    ));
    toast({
      title: "Task Started",
      description: "Task has been started.",
    });
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "Task has been removed.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks & Workflows</h1>
          <p className="text-muted-foreground">
            Manage tasks and workflow processes
          </p>
        </div>
        <Button onClick={handleNewTask} disabled={isAddingTask}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* INLINE TASK FORM */}
      {isAddingTask && (
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingTaskId ? 'Edit Task' : 'Add New Task'}
              <Button variant="ghost" size="sm" onClick={handleCancelForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="assignee">Assignee *</Label>
                  <Input
                    id="assignee"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    placeholder="Enter assignee name"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newTask.category} onValueChange={(value: 'general' | 'research' | 'trading' | 'compliance') => setNewTask({ ...newTask, category: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="trading">Trading</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button onClick={editingTaskId ? handleUpdateTask : handleAddTask} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  {editingTaskId ? 'Update Task' : 'Add Task'}
                </Button>
                <Button variant="outline" onClick={handleCancelForm} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>Assigned tasks and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                  {task.status === 'pending' ? (
                    <AlertCircle className="h-4 w-4 text-warning" />
                  ) : task.status === 'in_progress' ? (
                    <Clock className="h-4 w-4 text-blue-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{task.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {task.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStartTask(task.id)}
                      >
                        Start
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        Complete
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditTask(task.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
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
              {workflows.map((workflow) => (
                <div key={workflow.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  {workflow.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <Clock className="h-4 w-4 text-warning" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{workflow.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {workflow.status === 'completed' ? 'Completed' : 'In Progress'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {workflow.assignee}
                    </div>
                  </div>
                  <Badge className={getStatusColor(workflow.status)}>
                    {workflow.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TasksPage; 