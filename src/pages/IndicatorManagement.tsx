import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Indicator } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, Settings } from 'lucide-react';

export default function IndicatorManagement() {
  const { indicators, updateIndicator, toggleIndicator, deleteIndicator } = useData();
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', unit: '', source: '' });

  const activeIndicators = indicators.filter(ind => !ind.isDeleted);

  const handleEdit = (indicator: Indicator) => {
    setEditingIndicator(indicator);
    setEditForm({
      name: indicator.name,
      unit: indicator.unit,
      source: indicator.source,
    });
  };

  const handleSaveEdit = () => {
    if (editingIndicator) {
      updateIndicator(editingIndicator.id, editForm);
      setEditingIndicator(null);
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteIndicator(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Indicator Management</h1>
        <p className="text-muted-foreground">Manage statistical indicators and their metadata</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            All Indicators
          </CardTitle>
          <CardDescription>
            Enable/disable indicators, edit metadata, or remove them from the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Indicator Name</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeIndicators.map(indicator => (
                  <tr key={indicator.id}>
                    <td className="font-medium">{indicator.name}</td>
                    <td>
                      <Badge variant="outline">{indicator.category}</Badge>
                    </td>
                    <td>{indicator.unit}</td>
                    <td>{indicator.source}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={indicator.isEnabled}
                          onCheckedChange={() => toggleIndicator(indicator.id)}
                        />
                        <span className={indicator.isEnabled ? 'text-green-600' : 'text-muted-foreground'}>
                          {indicator.isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {new Date(indicator.updatedAt).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(indicator)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(indicator.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingIndicator} onOpenChange={() => setEditingIndicator(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Indicator</DialogTitle>
            <DialogDescription>
              Update the indicator metadata. Changes will reflect immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Indicator Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={editForm.unit}
                onChange={e => setEditForm(prev => ({ ...prev, unit: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={editForm.source}
                onChange={e => setEditForm(prev => ({ ...prev, source: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingIndicator(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Indicator?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete the indicator. It will no longer appear in dashboards
              or upload options. This action can be reversed by an administrator.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
