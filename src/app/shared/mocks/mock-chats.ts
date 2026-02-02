import { Chat } from '../../models/chat.model';

// MOCK_CHATS: Array de chats simulados
export const MOCK_CHATS: Chat[] = [
  {
    id: 1,
    idUsmya: 17, // Agustina Herrera
    tipo: 'general'
  },
  {
    id: 2,
    idUsmya: 18, // Mateo Fernandez
    tipo: 'general'
  },
  {
    id: 3,
    idUsmya: 19, // Otro USMYA
    tipo: 'general'
  }, {
    id: 4,
    idUsmya: 17, // Agustina Herrera
    tipo: 'tratante'
  },
  {
    id: 5,
    idUsmya: 18, // Mateo Fernandez
    tipo: 'tratante'
  },
  {
    id: 6,
    idUsmya: 19, // Otro USMYA
    tipo: 'tratante'
  }
];