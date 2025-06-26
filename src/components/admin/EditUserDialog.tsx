import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, UserRole } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface EditUserDialogProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, isOpen, onOpenChange, onUserUpdated }) => {
  const [role, setRole] = useState<UserRole>(user.role);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateUserByAdmin } = useAuth();

  useEffect(() => {
    setRole(user.role);
  }, [user]);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await updateUserByAdmin(user.uid, { role });
      onOpenChange(false);
      onUserUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to update user.');
    } finally {
      setLoading(false);
    }
  };
  
  const userRoles: UserRole[] = ['admin', 'manager', 'analyst', 'investor', 'compliance'];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User: {user.displayName}</DialogTitle>
          <DialogDescription>
            Update the user's details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <p className="col-span-3">{user.email}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select onValueChange={(value) => setRole(value as UserRole)} defaultValue={role}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {userRoles.map((r) => (
                  <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-red-500 text-center col-span-4">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 