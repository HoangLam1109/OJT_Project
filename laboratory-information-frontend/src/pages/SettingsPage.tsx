import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../components/common/card';
import { Button } from '../components/common/button';
import { Input } from '../components/common/input';
import { Label } from '../components/common/label';
import {
  Settings,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Plus,
  Edit
} from 'lucide-react';

interface SettingsPageProps {
  currentUser: any;
}

interface FlaggingConfig {
  id: string;
  parameter: string;
  lowThreshold: number;
  highThreshold: number;
  unit: string;
  severity: 'low' | 'medium' | 'high';
}

const mockFlaggingConfigs: FlaggingConfig[] = [
  {
    id: '1',
    parameter: 'WBC',
    lowThreshold: 4.0,
    highThreshold: 11.0,
    unit: 'K/uL',
    severity: 'medium'
  },
  {
    id: '2',
    parameter: 'RBC',
    lowThreshold: 4.2,
    highThreshold: 5.9,
    unit: 'M/uL',
    severity: 'medium'
  },
  {
    id: '3',
    parameter: 'Hemoglobin',
    lowThreshold: 12.0,
    highThreshold: 18.0,
    unit: 'g/dL',
    severity: 'high'
  },
  {
    id: '4',
    parameter: 'ALT',
    lowThreshold: 7,
    highThreshold: 40,
    unit: 'U/L',
    severity: 'medium'
  }
];

export function SettingsPage({ currentUser }: SettingsPageProps) {
  const [flaggingConfigs, setFlaggingConfigs] = useState<FlaggingConfig[]>(mockFlaggingConfigs);
  const [showAddConfigModal, setShowAddConfigModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<FlaggingConfig | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    labName: 'Advanced Laboratory Services',
    labAddress: '123 Medical Center Dr, Healthcare City, HC 12345',
    labPhone: '+1-555-LAB-TEST',
    labEmail: 'info@advancedlab.com',
    hl7SyncInterval: 5,
    autoBackupEnabled: true,
    backupRetentionDays: 30,
    aiReviewThreshold: 0.85,
    criticalAlertEmail: 'alerts@advancedlab.com'
  });

  // Instrument connections
  const [instruments, setInstruments] = useState([
    {
      id: '1',
      name: 'Hematology Analyzer',
      model: 'Sysmex XN-1000',
      status: 'connected',
      lastSync: '2024-10-08 10:30:00',
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      name: 'Chemistry Analyzer',
      model: 'Roche cobas c311',
      status: 'error',
      lastSync: '2024-10-08 08:15:00',
      ipAddress: '192.168.1.101'
    },
    {
      id: '3',
      name: 'Immunoassay Analyzer',
      model: 'Abbott Architect i1000SR',
      status: 'connected',
      lastSync: '2024-10-08 10:25:00',
      ipAddress: '192.168.1.102'
    }
  ]);

  const handleSaveSystemSettings = () => {
    // Save system settings logic
    console.log('Saving system settings:', systemSettings);
    alert('System settings saved successfully!');
  };

  const handleDeleteConfig = (configId: string) => {
    setFlaggingConfigs(configs => configs.filter(c => c.id !== configId));
  };

  const handleSyncInstrument = (instrumentId: string) => {
    setInstruments(instruments.map(inst => 
      inst.id === instrumentId 
        ? { ...inst, status: 'connected', lastSync: new Date().toISOString().replace('T', ' ').slice(0, 19) }
        : inst
    ));
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      connected: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      disconnected: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.disconnected;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure system parameters and integrations</p>
        </div>
        <Button onClick={handleSaveSystemSettings} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>

      {/* Laboratory Information */}
      <Card>
        <CardHeader>
          <CardTitle>Laboratory Information</CardTitle>
          <CardDescription>Basic laboratory details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="labName">Laboratory Name</Label>
              <Input
                id="labName"
                value={systemSettings.labName}
                onChange={(e) => setSystemSettings({...systemSettings, labName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labPhone">Phone Number</Label>
              <Input
                id="labPhone"
                value={systemSettings.labPhone}
                onChange={(e) => setSystemSettings({...systemSettings, labPhone: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="labAddress">Address</Label>
            <Input
              id="labAddress"
              value={systemSettings.labAddress}
              onChange={(e) => setSystemSettings({...systemSettings, labAddress: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="labEmail">Email</Label>
            <Input
              id="labEmail"
              type="email"
              value={systemSettings.labEmail}
              onChange={(e) => setSystemSettings({...systemSettings, labEmail: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Configure system behavior and automation settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hl7Sync">HL7 Sync Interval (minutes)</Label>
              <Input
                id="hl7Sync"
                type="number"
                min="1"
                value={systemSettings.hl7SyncInterval}
                onChange={(e) => setSystemSettings({...systemSettings, hl7SyncInterval: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backupRetention">Backup Retention (days)</Label>
              <Input
                id="backupRetention"
                type="number"
                min="1"
                value={systemSettings.backupRetentionDays}
                onChange={(e) => setSystemSettings({...systemSettings, backupRetentionDays: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aiThreshold">AI Review Threshold</Label>
              <Input
                id="aiThreshold"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={systemSettings.aiReviewThreshold}
                onChange={(e) => setSystemSettings({...systemSettings, aiReviewThreshold: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alertEmail">Critical Alert Email</Label>
              <Input
                id="alertEmail"
                type="email"
                value={systemSettings.criticalAlertEmail}
                onChange={(e) => setSystemSettings({...systemSettings, criticalAlertEmail: e.target.value})}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoBackup"
              checked={systemSettings.autoBackupEnabled}
              onChange={(e) => setSystemSettings({...systemSettings, autoBackupEnabled: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="autoBackup">Enable automatic backups</Label>
          </div>
        </CardContent>
      </Card>

      {/* Flagging Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Test Result Flagging</CardTitle>
              <CardDescription>Configure thresholds for automatic result flagging</CardDescription>
            </div>
            <Button onClick={() => setShowAddConfigModal(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Parameter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 font-medium text-gray-900">Parameter</th>
                  <th className="text-left p-3 font-medium text-gray-900">Low Threshold</th>
                  <th className="text-left p-3 font-medium text-gray-900">High Threshold</th>
                  <th className="text-left p-3 font-medium text-gray-900">Unit</th>
                  <th className="text-left p-3 font-medium text-gray-900">Severity</th>
                  <th className="text-center p-3 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flaggingConfigs.map((config) => (
                  <tr key={config.id} className="border-b border-gray-100">
                    <td className="p-3 font-medium text-gray-900">{config.parameter}</td>
                    <td className="p-3 text-gray-700">{config.lowThreshold}</td>
                    <td className="p-3 text-gray-700">{config.highThreshold}</td>
                    <td className="p-3 text-gray-700">{config.unit}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(config.severity)}`}>
                        {config.severity}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingConfig(config);
                            setShowEditModal(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteConfig(config.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Instrument Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Instrument Integration</CardTitle>
          <CardDescription>Monitor and manage laboratory instrument connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {instruments.map((instrument) => (
              <div key={instrument.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    instrument.status === 'connected' ? 'bg-green-500' :
                    instrument.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{instrument.name}</h4>
                    <p className="text-sm text-gray-600">{instrument.model}</p>
                    <p className="text-xs text-gray-500">IP: {instrument.ipAddress}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(instrument.status)}`}>
                      {instrument.status === 'connected' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {instrument.status === 'error' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {instrument.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Last sync: {new Date(instrument.lastSync).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSyncInstrument(instrument.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Manage your personal account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Full Name</Label>
              <Input
                id="userName"
                value={currentUser.name}
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <Input
                id="userEmail"
                value={currentUser.email}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userRole">Role</Label>
            <Input
              id="userRole"
              value={currentUser.role}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div className="pt-4">
            <Button variant="outline">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Config Modal */}
      {showAddConfigModal && (
        <AddConfigModal
          onClose={() => setShowAddConfigModal(false)}
          onAdd={(newConfig) => {
            setFlaggingConfigs([...flaggingConfigs, { 
              ...newConfig, 
              id: (flaggingConfigs.length + 1).toString() 
            }]);
            setShowAddConfigModal(false);
          }}
        />
      )}

      {/* Edit Config Modal */}
      {showEditModal && editingConfig && (
        <EditConfigModal
          config={editingConfig}
          onClose={() => {
            setShowEditModal(false);
            setEditingConfig(null);
          }}
          onSave={(updatedConfig) => {
            setFlaggingConfigs(configs => 
              configs.map(c => c.id === updatedConfig.id ? updatedConfig : c)
            );
            setShowEditModal(false);
            setEditingConfig(null);
          }}
        />
      )}
    </div>
  );
}

// Add Config Modal Component
function AddConfigModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (config: Omit<FlaggingConfig, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    parameter: '',
    lowThreshold: 0,
    highThreshold: 0,
    unit: '',
    severity: 'medium' as FlaggingConfig['severity']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Flagging Parameter</CardTitle>
          <CardDescription>Configure a new parameter for result flagging</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parameter">Parameter Name *</Label>
              <Input
                id="parameter"
                value={formData.parameter}
                onChange={(e) => setFormData({...formData, parameter: e.target.value})}
                required
                placeholder="e.g., WBC, RBC, Glucose"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lowThreshold">Low Threshold *</Label>
                <Input
                  id="lowThreshold"
                  type="number"
                  step="0.01"
                  value={formData.lowThreshold}
                  onChange={(e) => setFormData({...formData, lowThreshold: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="highThreshold">High Threshold *</Label>
                <Input
                  id="highThreshold"
                  type="number"
                  step="0.01"
                  value={formData.highThreshold}
                  onChange={(e) => setFormData({...formData, highThreshold: parseFloat(e.target.value)})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                required
                placeholder="e.g., K/uL, mg/dL, U/L"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level *</Label>
              <select
                id="severity"
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value as FlaggingConfig['severity']})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Add Parameter
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Edit Config Modal Component
function EditConfigModal({ config, onClose, onSave }: {
  config: FlaggingConfig;
  onClose: () => void;
  onSave: (config: FlaggingConfig) => void;
}) {
  const [formData, setFormData] = useState(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Flagging Parameter</CardTitle>
          <CardDescription>Update parameter configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parameter">Parameter Name *</Label>
              <Input
                id="parameter"
                value={formData.parameter}
                onChange={(e) => setFormData({...formData, parameter: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lowThreshold">Low Threshold *</Label>
                <Input
                  id="lowThreshold"
                  type="number"
                  step="0.01"
                  value={formData.lowThreshold}
                  onChange={(e) => setFormData({...formData, lowThreshold: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="highThreshold">High Threshold *</Label>
                <Input
                  id="highThreshold"
                  type="number"
                  step="0.01"
                  value={formData.highThreshold}
                  onChange={(e) => setFormData({...formData, highThreshold: parseFloat(e.target.value)})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level *</Label>
              <select
                id="severity"
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value as FlaggingConfig['severity']})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}