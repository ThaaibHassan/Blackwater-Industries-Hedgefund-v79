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
import { Task } from '@/types';
import { useData } from '@/context/DataContext';

const emptyTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  description: '',
  type: 'custom',
  status: 'pending',
  priority: 'medium',
  assigneeId: '',
  assigneeName: '',
  dueDate: new Date(),
  checklist: [],
  tags: [],
};

const TasksPage = () => {
  const { tasks, addTask, updateTask, deleteTask, completeTask, startTask } = useData();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>(emptyTask);
  const { toast } = useToast();

  const handleNewTask = () => {
    setIsAddingTask(true);
    setEditingTaskId(null);
    setNewTask(emptyTask);
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.description && newTask.assigneeId && newTask.assigneeName && newTask.dueDate) {
      const now = new Date();
      const task: Task = {
        ...newTask,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };
      addTask(task);
      setNewTask(emptyTask);
      setIsAddingTask(false);
      toast({
        title: 'Task Added',
        description: 'New task has been created successfully.',
      });
    } else {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setNewTask({
        title: task.title,
        description: task.description || '',
        type: task.type,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
        assigneeName: task.assigneeName,
        dueDate: typeof task.dueDate === 'string' ? new Date(task.dueDate) : task.dueDate,
        checklist: task.checklist || [],
        tags: task.tags || [],
      });
      setEditingTaskId(taskId);
      setIsAddingTask(true);
    }
  };

  const handleUpdateTask = () => {
    if (editingTaskId && newTask.title && newTask.description && newTask.assigneeId && newTask.assigneeName && newTask.dueDate) {
      const now = new Date();
      const updatedTask: Task = {
        ...newTask,
        id: editingTaskId,
        createdAt: now,
        updatedAt: now,
      };
      updateTask(updatedTask);
      setNewTask(emptyTask);
      setIsAddingTask(false);
      setEditingTaskId(null);
      toast({
        title: 'Task Updated',
        description: 'Task has been updated successfully.',
      });
    } else {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelForm = () => {
    setIsAddingTask(false);
    setEditingTaskId(null);
    setNewTask(emptyTask);
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
  };

  const handleStartTask = (taskId: string) => {
    startTask(taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    toast({
      title: 'Task Deleted',
      description: 'Task has been removed.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-primary/10 text-primary';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
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
        <Card className="border-2 border-primary/20 bg-primary/5">
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
                    value={newTask.assigneeName}
                    onChange={(e) => setNewTask({ ...newTask, assigneeName: e.target.value })}
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
                  <Select value={newTask.type} onValueChange={(value: 'research_analysis' | 'trade_review' | 'custom') => setNewTask({ ...newTask, type: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="research_analysis">Research Analysis</SelectItem>
                      <SelectItem value="trade_review">Trade Review</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate.toISOString().split('T')[0]}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: new Date(e.target.value) })}
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
                      Due: {task.dueDate.toLocaleDateString()}
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
              {/* Mock workflows array removed */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TasksPage; 