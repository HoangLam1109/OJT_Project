import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageCircle,
  PlusCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuthContext } from '../../hooks/useAuthContext';
import { Input } from '../../components/common/input';
import Button from '../../components/common/button';
import { apiUtils } from '../../service/apiClient';
import { roomApi, type RoomSummary } from '../../service/messageRoomService';

const parseDefaultLabUsers = (): string[] => {
  const raw = import.meta.env.VITE_DEFAULT_LAB_USER_IDS || '';
  return raw
    .split(',')
    .map((id: string) => id.trim())
    .filter(Boolean);
};

interface LabUserOption {
  id: string;
  label: string;
}

const parseLabUserOptions = (defaultIds: string[]): LabUserOption[] => {
  const raw = import.meta.env.VITE_LAB_USER_OPTIONS || '';
  const envOptions = raw
    .split(',')
    .map((entry) => {
      const [id, label] = entry.split('|').map((part) => part?.trim());
      if (!id) return null;
      return {
        id,
        label: label || id,
      } as LabUserOption;
    })
    .filter((opt): opt is LabUserOption => Boolean(opt));

  if (envOptions.length > 0) {
    return envOptions;
  }

  return defaultIds.map((id, index) => ({
    id,
    label: `Nhân viên phòng thí nghiệm #${index + 1}`,
  }));
};

const formatTime = (timestamp?: string): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString('vi-VN');
};

const ChatPage: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState('');
  const [creating, setCreating] = useState(false);

  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formCollapsed, setFormCollapsed] = useState(false);
  const [selectedLabUserId, setSelectedLabUserId] = useState('');

  const defaultLabUsers = useMemo(parseDefaultLabUsers, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) =>
      (room.name || 'Phòng chat').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rooms, searchTerm]);

  const refreshRooms = useCallback(async () => {
    if (!user) return;
    setLoadingRooms(true);
    try {
      const { data } = await roomApi.getParticipantRooms({
        limit: 50,
        sortOrder: 'desc',
        sortBy: 'updatedAt',
      });
      setRooms(data.data);
    } catch (error) {
      toast.error(apiUtils.getErrorMessage(error) || 'Không thể tải danh sách phòng chat');
    } finally {
      setLoadingRooms(false);
    }
  }, [user]);

  useEffect(() => {
    void refreshRooms();
  }, [refreshRooms]);

  const handleCreateRoom = async () => {
    if (!user) {
      toast.error('Bạn cần đăng nhập để tạo phòng chat');
      return;
    }
    const labTargets =
      selectedLabUserId !== ''
        ? [selectedLabUserId]
        : defaultLabUsers;

    if (labTargets.length === 0) {
      toast.error('Hệ thống chưa cấu hình nhóm nhân viên phòng thí nghiệm mặc định');
      return;
    }

    const participants = Array.from(new Set([user.id, ...labTargets]));
    setCreating(true);
    try {
      const { data: newRoom } = await roomApi.createRoom({
        name: roomName.trim() || undefined,
        participants,
      });

      setRooms((prev) => [newRoom, ...prev]);
      toast.success('Đã tạo phòng chat. Nhân viên phòng thí nghiệm sẽ phản hồi sớm nhất.');
      setRoomName('');

      navigate(`/user/chat/${newRoom._id}`, {
        state: { room: newRoom },
      });
    } catch (error) {
      toast.error(apiUtils.getErrorMessage(error) || 'Không thể tạo phòng chat');
    } finally {
      setCreating(false);
    }
  };

  const hasLabTarget = selectedLabUserId !== '' || defaultLabUsers.length > 0;
  const labUserOptions = useMemo(() => parseLabUserOptions(defaultLabUsers), [defaultLabUsers]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Yêu cầu phòng chat với phòng thí nghiệm</h2>
              <p className="text-sm text-gray-500">
                Tạo phòng để đặt câu hỏi; nhân viên phòng thí nghiệm sẽ thấy và phản hồi trong hệ thống.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFormCollapsed((prev) => !prev)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition"
          >
            {formCollapsed ? (
              <>
                <ChevronDown className="w-4 h-4" /> Mở rộng
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4" /> Thu gọn
              </>
            )}
          </button>
        </div>
        {!formCollapsed && (
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên phòng (tuỳ chọn)</label>
              <Input
                placeholder="Ví dụ: Thắc mắc kết quả xét nghiệm lần 2"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn nhân viên phòng thí nghiệm
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedLabUserId}
                onChange={(e) => setSelectedLabUserId(e.target.value)}
                disabled={labUserOptions.length === 0}
              >
                <option value="">
                  {labUserOptions.length === 0
                    ? 'Chưa cấu hình danh sách nhân viên'
                    : 'Tự động gửi đến nhóm mặc định'}
                </option>
                {labUserOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Nếu không chọn, phòng chat sẽ gửi tới nhóm lab mặc định ({defaultLabUsers.length} người).
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={handleCreateRoom}
                disabled={creating || !hasLabTarget}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <PlusCircle className="w-4 h-4" />
                {creating ? 'Đang tạo phòng...' : 'Tạo phòng chat'}
              </Button>
              {!hasLabTarget && (
                <span className="text-sm text-red-600">
                  Cần cấu hình `VITE_DEFAULT_LAB_USER_IDS` để gửi tới nhóm hỗ trợ.
                </span>
              )}
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 space-y-2">
              <p className="font-semibold">Lưu ý:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ngay khi tạo phòng, nhân viên phòng thí nghiệm sẽ thấy yêu cầu trong giao diện của họ.</li>
                <li>Bạn sẽ được thông báo khi nhân viên phản hồi qua các kênh liên lạc đã đăng ký.</li>
                <li>Nếu cần cập nhật thêm thông tin, bạn có thể tạo phòng mới hoặc tiếp tục trò chuyện trong phòng hiện tại.</li>
              </ul>
              {defaultLabUsers.length > 0 && (
                <p className="flex items-center gap-2 text-xs text-blue-700 pt-2">
                  <ShieldCheck className="w-4 h-4" />
                  Phòng chat sẽ tự động gửi đến nhóm lab mặc định trên hệ thống.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-[420px] border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2.5 mb-4 justify-between">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 flex-1">Phòng chat của bạn</h3>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                onClick={refreshRooms}
                title="Làm mới danh sách phòng chat"
              >
                {loadingRooms ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Tìm kiếm phòng chat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {filteredRooms.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {rooms.length === 0
                    ? 'Bạn chưa có phòng chat nào. Tạo phòng mới để bắt đầu trao đổi.'
                    : 'Không tìm thấy phòng chat phù hợp'}
                </p>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <button
                  key={room._id}
                  onClick={() => navigate(`/user/chat/${room._id}`, { state: { room } })}
                  className="w-full text-left px-4 py-3 border-b border-gray-200 hover:bg-white transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-white text-blue-600">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {room.name || 'Phòng chat'}
                        </h4>
                        <span className="text-xs text-gray-400">{formatTime(room.updatedAt)}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Thành viên: {room.participants.length}
                      </p>
                    </div>
                    <span className="text-xs text-blue-600 font-medium">Mở</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-sm text-gray-500 px-8">
          <MessageCircle className="w-14 h-14 text-gray-300 mb-4" />
          <p className="max-w-sm text-center">
            Chọn một phòng chat từ danh sách hoặc tạo phòng mới. Nội dung trò chuyện sẽ mở ra trong trang toàn màn
            hình để bạn trao đổi dễ dàng với nhân viên phòng thí nghiệm.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

