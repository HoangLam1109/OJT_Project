import  { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/card';
import  Button  from '../../components/common/button';
import  Badge  from '../../components/common/badge';
import { Input } from '../../components/common/input';
import { Label } from '../../components/common/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/common/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/common/dialog';
import { Progress } from '../../components/common/progress';
import { toast } from 'sonner';
import { TestTube, PlayCircle, Monitor, Search, CheckCircle, Clock, AlertCircle, Pause, XCircle } from 'lucide-react';
import { mockInstrument } from './data/mockInstrument';
import type { Instrument } from './types/Instrument';

interface Sample {
  id: string;
  barcode: string;
  patientId: string;
  patientName: string;
  testType: string;
  priority: 'urgent' | 'normal' | 'routine';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  assignedInstrument?: string;
  startTime?: string;
  estimatedCompletion?: string;
}



export function ServiceTestPage() {
  const [samples, setSamples] = useState<Sample[]>([
    {
      id: 'S001',
      barcode: 'BC-2024-001',
      patientId: 'P001',
      patientName: 'Nguyễn Văn A',
      testType: 'CBC',
      priority: 'urgent',
      status: 'pending'
    },
    {
      id: 'S002',
      barcode: 'BC-2024-002',
      patientId: 'P002',
      patientName: 'Trần Thị B',
      testType: 'Glucose',
      priority: 'normal',
      status: 'processing',
      progress: 45,
      assignedInstrument: 'INS001',
      startTime: '14:30',
      estimatedCompletion: '14:45'
    },
    {
      id: 'S003',
      barcode: 'BC-2024-003',
      patientId: 'P003',
      patientName: 'Lê Văn C',
      testType: 'Blood Count',
      priority: 'routine',
      status: 'pending'
    },
    {
      id: 'S004',
      barcode: 'BC-2024-004',
      patientId: 'P004',
      patientName: 'Phạm Minh D',
      testType: 'CBC',
      priority: 'urgent',
      status: 'processing',
      progress: 75,
      assignedInstrument: 'INS001',
      startTime: '14:15',
      estimatedCompletion: '14:30'
    },
    {
      id: 'S005',
      barcode: 'BC-2024-005',
      patientId: 'P005',
      patientName: 'Hoàng Thị E',
      testType: 'Cholesterol',
      priority: 'normal',
      status: 'completed',
      progress: 100,
      assignedInstrument: 'INS002',
      startTime: '13:45',
      estimatedCompletion: '14:00'
    }
  ]);
  const [instruments] = useState<Instrument[]>(mockInstrument);
  const [showStartTestDialog, setShowStartTestDialog] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const availableInstruments = instruments.filter(i => i.status === 'ready' && i.isActive);

  const handleStartTest = () => {
    if (!selectedSample || !selectedInstrument) {
      toast.error('Vui lòng chọn đầy đủ thông tin');
      return;
    }

    setSamples(samples.map(s => 
      s.id === selectedSample.id 
        ? {
            ...s,
            status: 'processing',
            progress: 0,
            assignedInstrument: selectedInstrument,
            startTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            estimatedCompletion: new Date(Date.now() + 15 * 60000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        : s
    ));

    toast.success('Đã bắt đầu xét nghiệm');
    setShowStartTestDialog(false);
    setSelectedSample(null);
    setSelectedInstrument('');
  };

  const handlePauseTest = (sampleId: string) => {
    setSamples(samples.map(s => 
      s.id === sampleId ? { ...s, status: 'pending' as const } : s
    ));
    toast.info('Đã tạm dừng xét nghiệm');
  };

  const handleCompleteTest = (sampleId: string) => {
    setSamples(samples.map(s => 
      s.id === sampleId ? { ...s, status: 'completed' as const, progress: 100 } : s
    ));
    toast.success('Xét nghiệm hoàn thành');
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Khẩn cấp</Badge>;
      case 'normal':
        return <Badge variant="default">Bình thường</Badge>;
      case 'routine':
        return <Badge variant="secondary">Thường quy</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Chờ xử lý</Badge>;
      case 'processing':
        return <Badge variant="default"><PlayCircle className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Hoàn thành</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Thất bại</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredSamples = samples.filter(s => 
    s.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.testType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    pending: samples.filter(s => s.status === 'pending').length,
    processing: samples.filter(s => s.status === 'processing').length,
    completed: samples.filter(s => s.status === 'completed').length,
    failed: samples.filter(s => s.status === 'failed').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Thực hiện Xét nghiệm</h2>
          <p className="text-gray-600">Khởi tạo và theo dõi quá trình xét nghiệm mẫu</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm mẫu..."
            className="pl-10 w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-strong">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chờ xử lý</p>
                <p className="text-2xl text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang xử lý</p>
                <p className="text-2xl text-blue-600">{stats.processing}</p>
              </div>
              <PlayCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoàn thành</p>
                <p className="text-2xl text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thất bại</p>
                <p className="text-2xl text-red-600">{stats.failed}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sample Queue */}
      <Card className="glass-strong hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Danh sách Mẫu
          </CardTitle>
          <CardDescription>
            Quản lý và theo dõi tiến độ xét nghiệm
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSamples.length > 0 ? (
            <div className="space-y-4">
              {filteredSamples.map((sample) => (
                <div 
                  key={sample.id} 
                  className="p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-mono">{sample.barcode}</h4>
                        {getPriorityBadge(sample.priority)}
                        {getStatusBadge(sample.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>Bệnh nhân: <span className="text-gray-900">{sample.patientName}</span></p>
                        <p>Loại xét nghiệm: <span className="text-gray-900">{sample.testType}</span></p>
                        {sample.assignedInstrument && (
                          <>
                            <p>Thiết bị: <span className="text-gray-900">{sample.assignedInstrument}</span></p>
                            <p>Bắt đầu: <span className="text-gray-900">{sample.startTime}</span></p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sample.status === 'pending' && (
                        <Button 
                          size="sm"
                          className="flex items-center gap-2 px-3 py-1"
                          onClick={() => {
                            setSelectedSample(sample);
                            setShowStartTestDialog(true);
                          }}
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Bắt đầu</span>
                        </Button>
                      )}
                      {sample.status === 'processing' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex items-center gap-2 px-3 py-1"
                            onClick={() => handlePauseTest(sample.id)}
                          >
                            <Pause className="w-4 h-4" />
                            <span>Tạm dừng</span>
                          </Button>
                          <Button 
                            size="sm"
                            className="flex items-center gap-2 px-3 py-1"
                            onClick={() => handleCompleteTest(sample.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Hoàn thành</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {sample.status === 'processing' && sample.progress !== undefined && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Tiến độ</span>
                        <span className="text-blue-600">{sample.progress}%</span>
                      </div>
                      <Progress value={sample.progress} className="h-2" />
                      {sample.estimatedCompletion && (
                        <p className="text-xs text-gray-500 mt-1">
                          Dự kiến hoàn thành: {sample.estimatedCompletion}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Không có mẫu nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Instruments */}
      <Card className="glass-strong hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Thiết bị Khả dụng ({availableInstruments.length})
          </CardTitle>
          <CardDescription>
            Danh sách thiết bị sẵn sàng thực hiện xét nghiệm
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availableInstruments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableInstruments.map((instrument) => (
                <div key={instrument.id} className="p-4 border rounded-lg bg-white/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-green-600" />
                      {instrument.name}
                    </h4>
                    <Badge variant="default" className="bg-green-600">Sẵn sàng</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span>{instrument.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vị trí:</span>
                      <span>{instrument.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hiệu suất:</span>
                      <span>{instrument.throughputPerHour} test/h</span>
                    </div>
                    {instrument.reagentLevel !== undefined && (
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Hóa chất:</span>
                          <span>{instrument.reagentLevel}%</span>
                        </div>
                        <Progress value={instrument.reagentLevel} className="h-1.5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Monitor className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>Không có thiết bị khả dụng</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Start Test Dialog */}
      <Dialog open={showStartTestDialog} onOpenChange={setShowStartTestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bắt đầu Xét nghiệm</DialogTitle>
            <DialogDescription>
              Chọn thiết bị để thực hiện xét nghiệm
            </DialogDescription>
          </DialogHeader>

          {selectedSample && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mã mẫu:</span>
                  <span className="font-mono">{selectedSample.barcode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Bệnh nhân:</span>
                  <span>{selectedSample.patientName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Loại xét nghiệm:</span>
                  <span>{selectedSample.testType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ưu tiên:</span>
                  {getPriorityBadge(selectedSample.priority)}
                </div>
              </div>

              <div>
                <Label htmlFor="instrument" className="mb-2">Chọn thiết bị *</Label>
                <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
                  <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left">
                    <SelectValue placeholder="Chọn thiết bị..." />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {availableInstruments
                      .filter(i => i.testTypes?.includes(selectedSample.testType))
                      .map((instrument) => (
                        <SelectItem key={instrument.id} value={instrument.id} className="px-3 py-2 hover:bg-gray-100">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-blue-500" />
                            <div className="text-sm">
                              <div className="font-medium">{instrument.name}</div>
                              <div className="text-xs text-gray-500">{instrument.location}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {availableInstruments.filter(i => i.testTypes?.includes(selectedSample.testType)).length === 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    Không có thiết bị nào hỗ trợ loại xét nghiệm này
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStartTestDialog(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleStartTest}
              disabled={!selectedInstrument}
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Bắt đầu xét nghiệm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
