import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { MessageCircle, Send, Search, User } from 'lucide-react';
import { Input } from '../../components/common/input';
import Button from '../../components/common/button';
import { toast } from 'sonner';

// Types
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'doctor' | 'patient';
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'doctor' | 'patient';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  avatar?: string;
}

const ChatPage: React.FC = () => {
  const { user } = useAuthContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data - sẽ thay thế bằng API call
  useEffect(() => {
    // Simulate loading conversations
    const mockConversations: Conversation[] = [
      {
        id: 'conv1',
        participantId: 'doc1',
        participantName: 'BS. Nguyễn Văn An',
        participantRole: 'doctor',
        lastMessage: 'Kết quả xét nghiệm của bạn đã sẵn sàng',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 2,
      },
      {
        id: 'conv2',
        participantId: 'doc2',
        participantName: 'BS. Trần Thị Bình',
        participantRole: 'doctor',
        lastMessage: 'Bạn có câu hỏi gì về kết quả không?',
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 0,
      },
    ];

    setConversations(mockConversations);
  }, []);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  const loadMessages = async (_conversationId: string) => {
    setLoading(true);
    try {
      // Mock messages - sẽ thay thế bằng API call
      // TODO: Sử dụng conversationId để gọi API
      const mockMessages: Message[] = [
        {
          id: 'msg1',
          senderId: user?.id || 'user1',
          senderName: user?.name || 'Bạn',
          senderRole: 'patient',
          content: 'Xin chào bác sĩ, tôi muốn hỏi về kết quả xét nghiệm',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          isRead: true,
        },
        {
          id: 'msg2',
          senderId: selectedConversation?.participantId || 'doc1',
          senderName: selectedConversation?.participantName || 'Bác sĩ',
          senderRole: 'doctor',
          content: 'Chào bạn, tôi đã xem kết quả xét nghiệm của bạn. Bạn muốn hỏi gì cụ thể?',
          timestamp: new Date(Date.now() - 86400000 + 300000).toISOString(),
          isRead: true,
        },
        {
          id: 'msg3',
          senderId: selectedConversation?.participantId || 'doc1',
          senderName: selectedConversation?.participantName || 'Bác sĩ',
          senderRole: 'doctor',
          content: 'Kết quả xét nghiệm của bạn đã sẵn sàng',
          timestamp: new Date().toISOString(),
          isRead: false,
        },
      ];

      setMessages(mockMessages);
    } catch (error) {
      toast.error('Không thể tải tin nhắn');
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: user?.id || 'user1',
      senderName: user?.name || 'Bạn',
      senderRole: 'patient',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    // Optimistic update
    setMessages([...messages, message]);
    setNewMessage('');

    // Update conversation last message
    setConversations(conversations.map(conv =>
      conv.id === selectedConversation.id
        ? {
            ...conv,
            lastMessage: message.content,
            lastMessageTime: message.timestamp,
          }
        : conv
    ));

    try {
      // TODO: Gọi API để gửi tin nhắn
      // await chatService.sendMessage(selectedConversation.id, newMessage);
      toast.success('Đã gửi tin nhắn');
    } catch (error) {
      toast.error('Không thể gửi tin nhắn');
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
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

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex h-full">
        {/* Chat List Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2.5 mb-4">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Tin nhắn</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Tìm kiếm cuộc trò chuyện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Không có cuộc trò chuyện nào</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`px-4 py-3 cursor-pointer transition-all duration-200 ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-white border-l-4 border-l-blue-600 shadow-sm'
                      : 'hover:bg-gray-100 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 ring-2 ring-white">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm text-gray-900 truncate">
                          {conversation.participantName}
                        </h3>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs font-medium rounded-full px-2 py-0.5 min-w-[20px] text-center flex-shrink-0 ml-2">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-600 truncate mb-1 leading-tight">
                          {conversation.lastMessage}
                        </p>
                      )}
                      {conversation.lastMessageTime && (
                        <p className="text-xs text-gray-400">
                          {formatTime(conversation.lastMessageTime)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-blue-50">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {selectedConversation.participantName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedConversation.participantRole === 'doctor' ? 'Bác sĩ' : 'Bệnh nhân'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 bg-gray-50 space-y-3">
                {loading ? (
                  <div className="text-center text-gray-500 py-8">Đang tải tin nhắn...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Chưa có tin nhắn nào</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwnMessage = message.senderId === user?.id;
                    return (
                      <div
                        key={message.id}
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
                              {message.senderName}
                            </p>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <p
                            className={`text-xs mt-1.5 ${
                              isOwnMessage ? 'text-blue-100' : 'text-gray-400'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-gray-200 bg-white">
                <div className="flex gap-3 items-center">
                  <Input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Send className="w-4 h-4" />
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
                  Chọn cuộc trò chuyện
                </h3>
                <p className="text-sm text-gray-500">
                  Chọn một cuộc trò chuyện từ danh sách để bắt đầu
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

