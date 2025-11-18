/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, MessageCircle, RefreshCw, Search, Send } from 'lucide-react';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Input } from '../../components/common/input';
import Button from '../../components/common/button';
import { toast } from 'sonner';
import { apiUtils } from '../../service/apiClient';
import {
  messageApi,
  roomApi,
  type ChatMessage,
  type RoomSummary,
} from '../../service/messageRoomService';

const areMessagesEqual = (current: ChatMessage[], next: ChatMessage[]): boolean => {
  if (current.length !== next.length) return false;
  for (let i = 0; i < current.length; i++) {
    if (current[i]._id !== next[i]._id || current[i].updatedAt !== next[i].updatedAt) {
      return false;
    }
  }
  return true;
};

const LabUserChatPage: React.FC = () => {
  const { user } = useAuthContext();
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesSnapshotRef = useRef<ChatMessage[]>([]);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room._id === selectedRoomId) ?? null,
    [rooms, selectedRoomId]
  );

  const getDisplayName = (userId?: string) => {
    if (!userId) return 'Người dùng';
    return userId === user?.id ? 'Nhân viên phòng thí nghiệm' : 'Người dùng';
  };

  const loadMessages = useCallback(
    async (roomId: string, options?: { background?: boolean }) => {
      const isBackground = options?.background;
      if (!isBackground) {
        setLoadingMessages(true);
      }
      try {
        const { data } = await messageApi.getRoomMessages(roomId, {
          limit: 100,
          sortBy: 'createdAt',
          sortOrder: 'asc',
        });
        if (!areMessagesEqual(messagesSnapshotRef.current, data.data)) {
          messagesSnapshotRef.current = data.data;
          setMessages(data.data);
        }
      } catch (error) {
        toast.error(apiUtils.getErrorMessage(error) || 'Không thể tải tin nhắn');
      } finally {
        if (!isBackground) {
          setLoadingMessages(false);
        }
      }
    },
    []
  );

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) =>
      (room.name || 'Phòng chat').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rooms, searchTerm]);

  useEffect(() => {
    refreshRooms();
  }, []);

  useEffect(() => {
    if (selectedRoomId) {
      void loadMessages(selectedRoomId);
    } else {
      setMessages([]);
    }
  }, [selectedRoomId, loadMessages]);

  const refreshRooms = async () => {
    if (!user) return;
    setLoadingRooms(true);
    try {
      const { data } = await roomApi.getParticipantRooms({
        limit: 50,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
      });
      const onlyUserRooms = data.data.filter((room) => room.createdBy !== user.id);
      setRooms(onlyUserRooms);

      if (!selectedRoomId && onlyUserRooms.length > 0) {
        setSelectedRoomId(onlyUserRooms[0]._id);
      } else if (
        selectedRoomId &&
        !onlyUserRooms.some((room) => room._id === selectedRoomId)
      ) {
        setSelectedRoomId(onlyUserRooms[0]?._id ?? null);
      }
    } catch (error) {
      toast.error(apiUtils.getErrorMessage(error) || 'Không thể tải danh sách phòng chat');
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    if (!selectedRoomId) return;
    const interval = setInterval(() => {
      void loadMessages(selectedRoomId, { background: true });
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedRoomId, loadMessages]);

  useEffect(() => {
    if (!loadingMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loadingMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoomId || !user) return;

    const optimisticMessage: ChatMessage = {
      _id: `tmp-${Date.now()}`,
      roomId: selectedRoomId,
      userId: user.id,
      text: newMessage.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage('');
    setSending(true);

    try {
      await messageApi.sendMessage(selectedRoomId, optimisticMessage.text);
      await loadMessages(selectedRoomId);
      toast.success('Đã gửi tin nhắn');
    } catch (error) {
      toast.error(apiUtils.getErrorMessage(error) || 'Không thể gửi tin nhắn');
      setMessages((prev) =>
        prev.filter((message) => message._id !== optimisticMessage._id)
      );
    }
    setSending(false);
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN');
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-4 border-r border-gray-200 flex flex-col bg-white">
          <div className="p-5 border-b border-gray-200 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Yêu cầu từ người dùng</h2>
              </div>
              <button
                type="button"
                onClick={refreshRooms}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                {loadingRooms ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Làm mới
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Danh sách dưới đây chỉ hiển thị các phòng chat do người dùng gửi yêu cầu
              (creator = user). Bạn chỉ cần chọn phòng để phản hồi.
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm theo tên phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50">
            {filteredRooms.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {rooms.length === 0
                    ? 'Chưa có yêu cầu nào từ người dùng.'
                    : 'Không tìm thấy phòng chat phù hợp'}
                </p>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <button
                  type="button"
                  key={room._id}
                  onClick={() => setSelectedRoomId(room._id)}
                  className={`w-full text-left px-4 py-3 border-l-4 transition ${
                    selectedRoomId === room._id
                      ? 'bg-white border-blue-600 shadow'
                      : 'border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 ring-2 ring-white">
                      <UserIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm text-gray-900 truncate">
                          {room.name || 'Phòng chat'}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {formatTime(room.updatedAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        Người tạo: {getDisplayName(room.createdBy)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Thành viên: {room.participants.length}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="col-span-8 flex flex-col bg-white">
          {selectedRoom ? (
            <>
              <div className="px-6 py-4 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {selectedRoom.name || 'Phòng chat'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Người tạo: {getDisplayName(selectedRoom.createdBy)} • ID phòng: {selectedRoom._id}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 bg-gray-50 space-y-3">
                {loadingMessages ? (
                  <div className="text-center text-gray-500 py-8">
                    Đang tải tin nhắn...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Chưa có tin nhắn nào</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwnMessage = message.userId === user?.id;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} items-end`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                            isOwnMessage
                              ? 'bg-blue-600 text-white rounded-br-md'
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                          }`}
                        >
                          {!isOwnMessage && (
                            <p className="text-xs font-semibold mb-1.5 text-gray-700">
                              {getDisplayName(message.userId)}
                            </p>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.text}
                          </p>
                          <p
                            className={`text-xs mt-1.5 ${
                              isOwnMessage ? 'text-blue-100' : 'text-gray-400'
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-white sticky bottom-0 z-10">
                <div className="flex gap-3 items-center">
                  <Input
                    type="text"
                    placeholder="Nhập phản hồi cho người dùng..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !selectedRoomId || sending}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center max-w-sm">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có phòng nào được chọn
                </h3>
                <p className="text-sm text-gray-500">
                  Hãy chọn một yêu cầu từ danh sách bên trái để bắt đầu phản hồi.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabUserChatPage;


