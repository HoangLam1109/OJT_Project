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
  Download,
  Search,
  Filter,
  Calendar,
  FileText,
  Users,
  TestTube2,
  Activity,
  Eye,
  RefreshCw
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  service: 'IAM' | 'Patient' | 'Test Order';
  eventCode: string;
  action: string;
  user: string;
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'error';
}

interface AuditReportsPageProps {
  currentUser: any;
}

// Mock audit logs
const mockAuditLogs: AuditLog[] = [
  {
    id: '1001',
    timestamp: '2024-10-08T10:30:00',
    service: 'IAM',
    eventCode: 'USER_LOGIN',
    action: 'User logged in',
    user: 'admin@lab.com',
    details: 'Successful login from admin dashboard',
    ipAddress: '192.168.1.100',
    severity: 'info'
  },
  {
    id: '1002',
    timestamp: '2024-10-08T10:25:00',
    service: 'Test Order',
    eventCode: 'ORDER_CREATED',
    action: 'Test order created',
    user: 'technician@lab.com',
    details: 'Created order T005 for patient P001',
    ipAddress: '192.168.1.101',
    severity: 'info'
  },
  {
    id: '1003',
    timestamp: '2024-10-08T10:20:00',
    service: 'Patient',
    eventCode: 'PATIENT_UPDATED',
    action: 'Patient record updated',
    user: 'labuser@lab.com',
    details: 'Updated contact information for patient P002',
    ipAddress: '192.168.1.102',
    severity: 'info'
  },
  {
    id: '1004',
    timestamp: '2024-10-08T10:15:00',
    service: 'Test Order',
    eventCode: 'RESULT_FLAGGED',
    action: 'Result flagged as critical',
    user: 'system',
    details: 'AI flagged abnormal WBC count for patient P003',
    ipAddress: '127.0.0.1',
    severity: 'warning'
  },
  {
    id: '1005',
    timestamp: '2024-10-08T10:10:00',
    service: 'IAM',
    eventCode: 'USER_FAILED_LOGIN',
    action: 'Failed login attempt',
    user: 'unknown@lab.com',
    details: 'Invalid credentials provided',
    ipAddress: '192.168.1.105',
    severity: 'error'
  },
  {
    id: '1006',
    timestamp: '2024-10-08T10:05:00',
    service: 'Test Order',
    eventCode: 'RESULT_VALIDATED',
    action: 'Test result validated',
    user: 'manager@lab.com',
    details: 'Validated results for order T003',
    ipAddress: '192.168.1.103',
    severity: 'info'
  }
];

export function AuditReportsPage({ currentUser }: AuditReportsPageProps) {
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.eventCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = selectedService === 'all' || log.service === selectedService;
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const logDate = new Date(log.timestamp);
      if (dateFrom) {
        matchesDate = matchesDate && logDate >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDate = matchesDate && logDate <= new Date(dateTo + 'T23:59:59');
      }
    }
    
    return matchesSearch && matchesService && matchesSeverity && matchesDate;
  });

  const getSeverityColor = (severity: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || colors.info;
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'IAM':
        return <Users className="h-4 w-4" />;
      case 'Patient':
        return <Users className="h-4 w-4" />;
      case 'Test Order':
        return <TestTube2 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const handleExportLogs = (format: 'csv' | 'pdf') => {
    // Mock export functionality
    const filename = `audit_logs_${new Date().toISOString().split('T')[0]}.${format}`;
    console.log(`Exporting ${filteredLogs.length} logs as ${format.toUpperCase()}:`, filename);
    alert(`Exported ${filteredLogs.length} audit logs as ${format.toUpperCase()}`);
  };

  const handleGenerateReport = () => {
    // Mock report generation
    console.log('Generating comprehensive audit report...');
    alert('Comprehensive audit report generated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit & Reports</h1>
          <p className="text-gray-600 mt-1">Monitor system activity and generate compliance reports</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleGenerateReport} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button onClick={() => handleExportLogs('csv')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => handleExportLogs('pdf')} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">IAM Events</p>
                <p className="text-2xl font-bold text-blue-600">
                  {auditLogs.filter(log => log.service === 'IAM').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Test Events</p>
                <p className="text-2xl font-bold text-green-600">
                  {auditLogs.filter(log => log.service === 'Test Order').length}
                </p>
              </div>
              <TestTube2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Errors/Warnings</p>
                <p className="text-2xl font-bold text-red-600">
                  {auditLogs.filter(log => log.severity === 'error' || log.severity === 'warning').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Service Filter */}
            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <select
                id="service"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Services</option>
                <option value="IAM">IAM</option>
                <option value="Patient">Patient</option>
                <option value="Test Order">Test Order</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <select
                id="severity"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Severities</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {filteredLogs.length} of {auditLogs.length} events
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedService('all');
                setSelectedSeverity('all');
                setDateFrom('');
                setDateTo('');
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>Detailed system activity logs with filtering and export capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 font-medium text-gray-900">Timestamp</th>
                  <th className="text-left p-3 font-medium text-gray-900">Service</th>
                  <th className="text-left p-3 font-medium text-gray-900">Event</th>
                  <th className="text-left p-3 font-medium text-gray-900">User</th>
                  <th className="text-left p-3 font-medium text-gray-900">Details</th>
                  <th className="text-left p-3 font-medium text-gray-900">Severity</th>
                  <th className="text-center p-3 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getServiceIcon(log.service)}
                        <span className="text-sm font-medium text-gray-900">{log.service}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{log.action}</p>
                        <p className="text-gray-600">{log.eventCode}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{log.user}</p>
                        <p className="text-gray-600">{log.ipAddress}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="text-sm text-gray-900 max-w-xs truncate">{log.details}</p>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            alert(`Viewing details for log ID: ${log.id}\n\nFull Details:\n${log.details}\n\nTimestamp: ${log.timestamp}\nIP Address: ${log.ipAddress}`);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Generation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Report Generation</CardTitle>
          <CardDescription>Generate comprehensive reports for compliance and analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Compliance Report</h4>
              <p className="text-sm text-gray-600 mb-4">
                Generate a comprehensive compliance report including all audit trails, user activities, and system events.
              </p>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate Compliance Report
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Test Orders Report</h4>
              <p className="text-sm text-gray-600 mb-4">
                Export detailed test order reports with patient information, results, and validation status.
              </p>
              <Button variant="outline" className="w-full">
                <TestTube2 className="h-4 w-4 mr-2" />
                Generate Test Report
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">User Activity Report</h4>
              <p className="text-sm text-gray-600 mb-4">
                Create reports focused on user activities, login patterns, and access controls.
              </p>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Generate User Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}