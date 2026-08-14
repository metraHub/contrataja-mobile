import { io, Socket } from 'socket.io-client';
import { storageService } from '../../../services/storage/storageService';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3000';

const NGROK_SKIP_WARNING_HEADER = { 'ngrok-skip-browser-warning': 'true' };

const COMMON_OPTIONS = {
  transports: ['polling', 'websocket'] as ['polling', 'websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  extraHeaders: NGROK_SKIP_WARNING_HEADER,
  // Belt-and-suspenders: transportOptions.polling.extraHeaders is the
  // socket.io-documented reliable spot for this, in case the top-level
  // extraHeaders isn't consistently applied by the RN XHR polyfill.
  transportOptions: {
    polling: { extraHeaders: NGROK_SKIP_WARNING_HEADER },
  },
};

class SocketService {
  private chatSocket: Socket | null = null;
  private jobCallsSocket: Socket | null = null;
  private serviceCallsSocket: Socket | null = null;
  private dispatchSocket: Socket | null = null;

  // ==================== CHAT ====================

  async connectChat() {
    if (this.chatSocket?.connected) return;
    const token = await storageService.getToken();
    if (this.chatSocket?.connected) return;
    this.chatSocket = io(`${SOCKET_URL}/chat`, {
      ...COMMON_OPTIONS,
      auth: { token },
    });
    this.chatSocket.on('connect_error', (err) => {
      console.log('[Socket/chat] erro de conexão:', err.message);
    });
  }

  joinChatRoom(roomId: string) {
    this.chatSocket?.emit('joinRoom', { roomId });
  }

  leaveChatRoom(roomId: string) {
    this.chatSocket?.emit('leaveRoom', { roomId });
  }

  sendMessage(receiverId: string, roomId: string, content: string, type = 'TEXT') {
    // senderId vem do JWT no backend — não precisa ser enviado no payload
    this.chatSocket?.emit('sendMessage', { receiverId, roomId, content, type });
  }

  onNewMessage(callback: (message: any) => void) {
    this.chatSocket?.off('newMessage');
    this.chatSocket?.on('newMessage', callback);
  }

  offNewMessage() {
    this.chatSocket?.off('newMessage');
  }

  emitTyping(roomId: string) {
    this.chatSocket?.emit('typing', { roomId });
  }

  emitStopTyping(roomId: string) {
    this.chatSocket?.emit('stopTyping', { roomId });
  }

  onUserTyping(callback: (data: { userId: string }) => void) {
    this.chatSocket?.off('userTyping');
    this.chatSocket?.on('userTyping', callback);
  }

  onUserStopTyping(callback: (data: { userId: string }) => void) {
    this.chatSocket?.off('userStopTyping');
    this.chatSocket?.on('userStopTyping', callback);
  }

  disconnectChat() {
    this.chatSocket?.disconnect();
    this.chatSocket = null;
  }

  // ==================== JOB CALLS ====================

  async connectJobCalls() {
    if (this.jobCallsSocket?.connected) return;
    const token = await storageService.getToken();
    if (this.jobCallsSocket?.connected) return;
    this.jobCallsSocket = io(`${SOCKET_URL}/job-calls`, {
      ...COMMON_OPTIONS,
      auth: { token },
    });
    this.jobCallsSocket.on('connect', () => {
      console.log('[Socket/job-calls] conectado');
      // joinJobRoom é opcional pois o backend já entra na sala via handleConnection
      this.jobCallsSocket?.emit('joinJobRoom', {});
    });
    this.jobCallsSocket.on('connect_error', (err) => {
      console.log('[Socket/job-calls] erro de conexão:', err.message);
    });
  }

  getJobCallsSocket() {
    return this.jobCallsSocket;
  }

  onNewJobMatch(callback: (data: any) => void) {
    this.jobCallsSocket?.off('newJobMatch');
    this.jobCallsSocket?.on('newJobMatch', callback);
  }

  onJobAccepted(callback: (data: any) => void) {
    this.jobCallsSocket?.off('jobAccepted');
    this.jobCallsSocket?.on('jobAccepted', callback);
  }

  offJobAccepted() {
    this.jobCallsSocket?.off('jobAccepted');
  }

  onInterviewSessionStarted(callback: (data: any) => void) {
    this.jobCallsSocket?.off('interviewSessionStarted');
    this.jobCallsSocket?.on('interviewSessionStarted', callback);
  }

  offInterviewSessionStarted() {
    this.jobCallsSocket?.off('interviewSessionStarted');
  }

  disconnectJobCalls() {
    this.jobCallsSocket?.disconnect();
    this.jobCallsSocket = null;
  }

  // ==================== SERVICE CALLS ====================

  async connectServiceCalls() {
    if (this.serviceCallsSocket?.connected) return;
    const token = await storageService.getToken();
    if (this.serviceCallsSocket?.connected) return;
    this.serviceCallsSocket = io(`${SOCKET_URL}/service-calls`, {
      ...COMMON_OPTIONS,
      auth: { token },
    });
    this.serviceCallsSocket.on('connect', () => {
      console.log('[Socket/service-calls] conectado');
      // Backend já entra na sala via handleConnection
      this.serviceCallsSocket?.emit('joinServiceRoom', {});
    });
    this.serviceCallsSocket.on('connect_error', (err) => {
      console.log('[Socket/service-calls] erro de conexão:', err.message);
    });
  }

  onNewServiceRequest(callback: (data: any) => void) {
    this.serviceCallsSocket?.off('newServiceRequest');
    this.serviceCallsSocket?.on('newServiceRequest', callback);
  }

  onServiceUpdated(callback: (data: any) => void) {
    this.serviceCallsSocket?.off('serviceUpdated');
    this.serviceCallsSocket?.on('serviceUpdated', callback);
  }

  disconnectServiceCalls() {
    this.serviceCallsSocket?.disconnect();
    this.serviceCallsSocket = null;
  }

  // ==================== DISPATCH ====================

  async connectDispatch() {
    if (this.dispatchSocket?.connected) return;
    const token = await storageService.getToken();
    if (this.dispatchSocket?.connected) return;
    this.dispatchSocket = io(`${SOCKET_URL}/dispatch`, {
      ...COMMON_OPTIONS,
      auth: { token },
    });
    this.dispatchSocket.on('connect', () => {
      console.log('[Socket/dispatch] conectado');
    });
    this.dispatchSocket.on('connect_error', (err) => {
      console.log('[Socket/dispatch] erro de conexão:', err.message);
    });
  }

  watchJob(jobCallId: string) {
    this.dispatchSocket?.emit('watchJob', { jobCallId });
  }

  onDispatchStats(callback: (stats: any) => void) {
    this.dispatchSocket?.off('dispatch:stats');
    this.dispatchSocket?.on('dispatch:stats', callback);
  }

  onCandidateViewed(callback: (data: { candidateId: string }) => void) {
    this.dispatchSocket?.off('dispatch:candidate_viewed');
    this.dispatchSocket?.on('dispatch:candidate_viewed', callback);
  }

  onCandidateInterested(callback: (data: { candidateId: string; score: number }) => void) {
    this.dispatchSocket?.off('dispatch:candidate_interested');
    this.dispatchSocket?.on('dispatch:candidate_interested', callback);
  }

  disconnectDispatch() {
    this.dispatchSocket?.disconnect();
    this.dispatchSocket = null;
  }

  // ==================== DISCONNECT ALL ====================

  disconnectAll() {
    this.disconnectChat();
    this.disconnectJobCalls();
    this.disconnectServiceCalls();
    this.disconnectDispatch();
  }
}

export const socketService = new SocketService();
