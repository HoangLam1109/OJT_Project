import { useState, useEffect } from "react";
import type { Instrument } from "./types/Instrument";
import {
    Monitor,
    Plus,
    CheckCircle,
    Wrench,
    PlayCircle,
    Trash2,
    Eye,
    Search,
} from "lucide-react";
import Button from "../../components/common/button";
import { Input } from "../../components/common/input";
import Badge from "../../components/common/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../../components/common/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../../components/common/table";
import { toast } from "sonner";
import { InstrumentDetailDialog } from "./components/InstrumentDetailDialog";
import { AddInstrumentDialog } from "./components/AddInstrumentDialog";
import { ChangeInstrumentStatusDialog } from "./components/ChangeInstrumentStatusDialog";
import { instrumentsService } from "../../service/instrumentsService";

export default function ServiceInstrumentPage() {
    const [instruments, setInstruments] = useState<Instrument[]>([]);
    const [instrumentSearchTerm, setInstrumentSearchTerm] = useState("");
    const [selectedInstrumentId, setSelectedInstrumentId] = useState<string | null>(null);
    const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [showChangeModeDialog, setShowChangeModeDialog] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await instrumentsService.getAllInstruments();
                setInstruments(data);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Không thể tải danh sách thiết bị";
                toast.error(message);
            }
        })();
    }, []);


    const handleChangeInstrumentStatus = (updatedInstrument: Instrument) => {
        setInstruments((prev) =>
            prev.map((i) =>
                i._id === updatedInstrument._id ? updatedInstrument : i
            )
        );
    };

    const handleAddInstrument = (instrument: Instrument) => {
        setInstruments((prev) => [...prev, instrument]);
        toast.success("Thiết bị đã được thêm thành công!");
    };
    const handleOpenDetail = (instrument: Instrument) => {
        setSelectedInstrumentId(instrument._id);
        setOpenDialog(true);
    };

    const handleDeleteInstrument = (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) return;
        setInstruments((prev) => prev.filter((i) => i._id !== id));
        // If the deleted instrument was opened in detail, close it
        if (selectedInstrumentId === id) {
            setSelectedInstrumentId(null);
            setOpenDialog(false);
        }
        toast.success('Thiết bị đã được xóa');
    };

    // 👉 Thống kê nhanh
    const stats = {
        totalInstruments: instruments.length,
        activeInstruments: instruments.filter((i) => i.is_active).length,
        readyInstruments: instruments.filter((i) => i.status === "Ready").length,
        maintenanceInstruments: instruments.filter((i) => i.status === "Maintenance").length,
    };

    // 👉 Lọc theo từ khóa
    const filteredInstruments = instruments.filter((instrument) => {
        const searchLower = instrumentSearchTerm.toLowerCase();
        return (
            instrument.instrument_name.toLowerCase().includes(searchLower) ||
            instrument.instrument_type.toLowerCase().includes(searchLower) ||
            instrument.manufacturer?.toLowerCase().includes(searchLower) ||
            instrument.location?.toLowerCase().includes(searchLower) ||
            instrument._id.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold">Quản lý Thiết bị</h2>
                    <p className="text-gray-600">
                        Thêm, xem, kích hoạt/vô hiệu hóa thiết bị
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Tìm kiếm thiết bị..."
                            className="pl-10 w-80"
                            value={instrumentSearchTerm}
                            onChange={(e) => setInstrumentSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                         className="
    flex items-center 
    bg-gradient-to-r from-blue-500 to-indigo-600
    text-white font-medium shadow-md
    px-4 py-2 rounded-lg
    hover:from-blue-600 hover:to-indigo-700
    hover:shadow-lg
    focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
    transition-all duration-200 ease-in-out
  "
                        onClick={() => setOpenAddDialog(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm thiết bị
                    </Button>
                </div>
            </div>

            {/* Thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass-strong hover-lift">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Tổng thiết bị</p>
                                <p className="text-2xl text-blue-600">{stats.totalInstruments}</p>
                            </div>
                            <Monitor className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-strong hover-lift">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
                                <p className="text-2xl text-green-600">{stats.activeInstruments}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-strong hover-lift">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Sẵn sàng</p>
                                <p className="text-2xl text-blue-600">{stats.readyInstruments}</p>
                            </div>
                            <PlayCircle className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-strong hover-lift">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Đang bảo trì</p>
                                <p className="text-2xl text-orange-600">{stats.maintenanceInstruments}</p>
                            </div>
                            <Wrench className="w-8 h-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Danh sách thiết bị */}
            <Card className="glass-strong hover-lift">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Danh sách Thiết bị</CardTitle>
                            <CardDescription>
                                Hiển thị {filteredInstruments.length} / {instruments.length} thiết bị
                            </CardDescription>
                        </div>
                        {instrumentSearchTerm && (
                            <Button variant="outline" size="sm" onClick={() => setInstrumentSearchTerm("")}>
                                Xóa bộ lọc
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredInstruments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tên thiết bị</TableHead>
                                    <TableHead>Loại thiết bị</TableHead>
                                    <TableHead>Vị trí</TableHead>
                                    <TableHead>Trạng thái</TableHead>   
                                    <TableHead>Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInstruments.map((instrument) => (
                                    <TableRow key={instrument._id}>
                                        <TableCell>{instrument.instrument_name}</TableCell>
                                        <TableCell>{instrument.instrument_type}</TableCell>
                                        <TableCell>{instrument.location}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    instrument.status === "Ready"
                                                        ? "default"
                                                        : instrument.status === "Processing"
                                                            ? "secondary"
                                                            : instrument.status === "Maintenance"
                                                                ? "outline"
                                                                : "destructive"
                                                }
                                            >
                                                {instrument.status === "Ready"
                                                    ? "Sẵn sàng"
                                                    : instrument.status === "Processing"
                                                        ? "Đang chạy"
                                                        : instrument.status === "Maintenance"
                                                            ? "Bảo trì"
                                                            : instrument.status === "Error"
                                                                ? "Lỗi"
                                                                : "Ngưng hoạt động"}
                                            </Badge>
                                        </TableCell>
                                        
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenDetail(instrument)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedInstrument(instrument);
                                                        setShowChangeModeDialog(true);
                                                    }}
                                                >
                                                    <Wrench className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteInstrument(instrument._id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12">
                            <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg text-gray-900 mb-2">Không tìm thấy thiết bị</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Không có thiết bị nào phù hợp với tiêu chí tìm kiếm
                            </p>
                            <Button variant="outline" onClick={() => setInstrumentSearchTerm("")}>
                                Xóa bộ lọc
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            <ChangeInstrumentStatusDialog
                open={showChangeModeDialog}
                onOpenChange={setShowChangeModeDialog}
                instrument={selectedInstrument}
                onStatusChange={handleChangeInstrumentStatus}
            />

            <AddInstrumentDialog
                open={openAddDialog}
                onOpenChange={setOpenAddDialog}
                onAddInstrument={handleAddInstrument}
            />
            <InstrumentDetailDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                instrumentId={selectedInstrumentId} 
            />
        </div>
    );
}
