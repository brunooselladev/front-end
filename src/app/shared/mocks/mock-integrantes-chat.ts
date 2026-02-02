import { IntegrantesChat } from '../../models/integrantes-chat.model';

// MOCK_INTEGRANTES_CHAT: Array de integrantes de chat simulados
// Cada chat tiene 3 usuarios diferentes con roles variados
export const MOCK_INTEGRANTES_CHAT: IntegrantesChat[] = [
  // Chat 1 (USMYA 17 - Agustina Herrera): Agente, Efector, Referente
  {
    id: 1,
    idChat: 1,
    idUser: 6 // Agente: Pedro Ramirez
  },
  {
    id: 2,
    idChat: 1,
    idUser: 9 // Efector: Dr. Juan Perez
  },
  {
    id: 3,
    idChat: 1,
    idUser: 13 // Referente: Marcela Suarez
  }, /*------- */

  {
    id: 10,
    idChat: 4,
    idUser: 9 // Agente: Pedro Ramirez
  },
  {
    id: 11,
    idChat: 5,
    idUser: 9 // Efector: Dr. Juan Perez
  },
  {
    id: 12,
    idChat: 6,
    idUser: 9 // Referente: Marcela Suarez
  },
  {
    id: 13,
    idChat: 4,
    idUser: 10 // Referente: Marcela Suarez
  },
  {
    id: 14,
    idChat: 4,
    idUser: 11 // Referente: Marcela Suarez
  },

  // Chat 2 (USMYA 18 - Mateo Fernandez): Agente, Efector, Referente (diferentes)
  {
    id: 4,
    idChat: 2,
    idUser: 9 // Agente: Sofia Mendez
  },
  {
    id: 5,
    idChat: 2,
    idUser: 10 // Efector: Dra. Laura Garcia
  },
  {
    id: 6,
    idChat: 2,
    idUser: 14 // Referente: Diego Morales
  },

  // Chat 3 (USMYA 19): Agente, Efector, Referente (diferentes)
  {
    id: 7,
    idChat: 3,
    idUser: 8 // Agente: Carmen Torres
  },
  {
    id: 8,
    idChat: 3,
    idUser: 9 // Efector: Dra. Valentina Rodriguez
  },
  {
    id: 9,
    idChat: 3,
    idUser: 13 // Referente: Fernando Castro
  }
];