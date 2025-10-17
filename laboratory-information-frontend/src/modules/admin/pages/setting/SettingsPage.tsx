import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../../components/common/card';
import Button from '../../../../components/common/button';
import { Input } from '../../../../components/common/input';
import { Label } from '../../../../components/common/label';
import {
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
    console.log('Đang lưu cài đặt hệ thống:', systemSettings);
    alert('Đã lưu cài đặt hệ thống thành công!');
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
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-gray-600 mt-1">Cấu hình tham số và tích hợp hệ thống</p>
        </div>
        <Button onClick={handleSaveSystemSettings} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="h-4 w-4 mr-2" />
          Lưu tất cả cài đặt
        </Button>
      </div>

      {/* Laboratory Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin phòng xét nghiệm</CardTitle>
          <CardDescription>Thông tin cơ bản và liên hệ của phòng xét nghiệm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="labName">Tên phòng xét nghiệm</Label>
              <Input
                id="labName"
                value={systemSettings.labName}
                onChange={(e) => setSystemSettings({...systemSettings, labName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labPhone">Số điện thoại</Label>
              <Input
                id="labPhone"
                value={systemSettings.labPhone}
                onChange={(e) => setSystemSettings({...systemSettings, labPhone: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="labAddress">Địa chỉ</Label>
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
          <CardTitle>Cấu hình hệ thống</CardTitle>
          <CardDescription>Cấu hình hoạt động và tự động hóa hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hl7Sync">Chu kỳ đồng bộ HL7 (phút)</Label>
              <Input
                id="hl7Sync"
                type="number"
                min="1"
                value={systemSettings.hl7SyncInterval}
                onChange={(e) => setSystemSettings({...systemSettings, hl7SyncInterval: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backupRetention">Thời gian lưu trữ sao lưu (ngày)</Label>
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
              <Label htmlFor="aiThreshold">Ngưỡng đánh giá AI</Label>
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
              <Label htmlFor="alertEmail">Email cảnh báo quan trọng</Label>
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
            <Label htmlFor="autoBackup">Bật sao lưu tự động</Label>
          </div>
        </CardContent>
      </Card>

      {/* Flagging Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cấu hình đánh dấu kết quả</CardTitle>
              <CardDescription>Cấu hình ngưỡng cho đánh dấu kết quả tự động</CardDescription>
            </div>
            <Button onClick={() => setShowAddConfigModal(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Thêm thông số
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 font-medium text-gray-900">Thông số</th>
                  <th className="text-left p-3 font-medium text-gray-900">Ngưỡng thấp</th>
                  <th className="text-left p-3 font-medium text-gray-900">Ngưỡng cao</th>
                  <th className="text-left p-3 font-medium text-gray-900">Đơn vị</th>
                  <th className="text-left p-3 font-medium text-gray-900">Mức độ</th>
                  <th className="text-center p-3 font-medium text-gray-900">Thao tác</th>
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
          <CardTitle>Tích hợp thiết bị</CardTitle>
          <CardDescription>Giám sát và quản lý kết nối thiết bị phòng xét nghiệm</CardDescription>
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
                      {instrument.status === 'connected' ? 'Đã kết nối' : 
                       instrument.status === 'error' ? 'Lỗi' : 'Ngắt kết nối'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Đồng bộ lần cuối: {new Date(instrument.lastSync).toLocaleString()}
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
          <CardTitle>Hồ sơ người dùng</CardTitle>
          <CardDescription>Quản lý cài đặt tài khoản cá nhân</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Họ và tên</Label>
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
            <Label htmlFor="userRole">Vai trò</Label>
            <Input
              id="userRole"
              value={currentUser.role}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div className="pt-4">
            <Button variant="outline">
              Đổi mật khẩu
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
          <CardTitle>Thêm thông số đánh dấu</CardTitle>
          <CardDescription>Cấu hình thông số mới cho đánh dấu kết quả</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parameter">Tên thông số *</Label>
              <Input
                id="parameter"
                value={formData.parameter}
                onChange={(e) => setFormData({...formData, parameter: e.target.value})}
                required
                placeholder="Ví dụ: WBC, RBC, Glucose"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lowThreshold">Ngưỡng thấp *</Label>
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
                <Label htmlFor="highThreshold">Ngưỡng cao *</Label>
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
              <Label htmlFor="unit">Đơn vị *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                required
                placeholder="Ví dụ: K/uL, mg/dL, U/L"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Mức độ nghiêm trọng *</Label>
              <select
                id="severity"
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value as FlaggingConfig['severity']})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Thêm thông số
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
          <CardTitle>Chỉnh sửa thông số đánh dấu</CardTitle>
          <CardDescription>Cập nhật cấu hình thông số</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parameter">Tên thông số *</Label>
              <Input
                id="parameter"
                value={formData.parameter}
                onChange={(e) => setFormData({...formData, parameter: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lowThreshold">Ngưỡng thấp *</Label>
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
                <Label htmlFor="highThreshold">Ngưỡng cao *</Label>
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
              <Label htmlFor="unit">Đơn vị *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Mức độ nghiêm trọng *</Label>
              <select
                id="severity"
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value as FlaggingConfig['severity']})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}