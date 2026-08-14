// Deriva o mesmo roomId determinístico usado em todo ponto de entrada do
// chat, independente da ordem dos participantes — mantém PF e empresa
// sempre na mesma thread (mirror de ChatService.generateRoomId no backend).
export function buildRoomId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join(':');
}
