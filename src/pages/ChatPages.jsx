import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';
import Modal from '../components/Modal';
import PageShell from '../components/PageShell';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { chatService, integrantesChatService, mensajeService, usuarioService } from '../services';
import { formatDate } from '../utils/formatters';

function getRolePrefix(role) {
  if (role === 'efector') return '/efector';
  if (role === 'referente') return '/referente';
  return '/agente';
}

function UserPickerModal({
  open,
  title,
  users,
  loading,
  search,
  onSearchChange,
  selectedUser,
  onSelect,
  onConfirm,
  onClose,
  confirmLabel,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      actions={
        <>
          <button className="btn btn-primary" type="button" disabled={!selectedUser} onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button className="btn" type="button" onClick={onClose}>
            Cancelar
          </button>
        </>
      }
    >
      <div className="grid">
        <input
          className="filter-input"
          placeholder="Buscar USMYA"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {loading ? <p>Cargando...</p> : null}
        {!loading && !users.length ? <p>No hay usuarios disponibles.</p> : null}
        <div className="list-picker">
          {users.map((user) => (
            <button
              key={user.id}
              type="button"
              className={`picker-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
              onClick={() => onSelect(user)}
            >
              <strong>{user.nombre}</strong>
              <span>DNI: {user.dni || '-'} | Alias: {user.alias || '-'}</span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export function ChatListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, loading: userLoading } = useCurrentUser();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerUsers, setPickerUsers] = useState([]);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerLoading, setPickerLoading] = useState(false);
  const [selectedPickerUser, setSelectedPickerUser] = useState(null);

  const chatType = location.pathname.includes('chat-tratante') ? 'tratante' : 'general';

  const loadChats = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const memberships = await integrantesChatService.getChatsByUserId(currentUser.id);
      const chatIds = [...new Set((memberships || []).map((item) => Number(item.idChat)))];
      const chatData = await Promise.all(chatIds.map((chatId) => chatService.getChatById(chatId)));
      const filtered = chatData.filter((chat) => chat && chat.tipo === chatType);

      const enriched = await Promise.all(
        filtered.map(async (chat) => {
          const [usmya, lastMessage] = await Promise.all([
            usuarioService.getUserById(chat.idUsmya),
            mensajeService.getUltimoMensaje(chat.id),
          ]);
          return {
            ...chat,
            usmyaName: usmya?.nombre || `USMYA ${chat.idUsmya}`,
            usmyaAlias: usmya?.alias || '',
            lastMessage,
          };
        }),
      );

      setChats(enriched);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los chats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, [currentUser?.id, chatType]);

  useEffect(() => {
    if (!pickerOpen || !currentUser?.id) return;
    setPickerLoading(true);
    const searchPromise =
      currentUser.role === 'efector'
        ? usuarioService.searchAvailableUsmyaForEfector(pickerSearch, currentUser.id)
        : usuarioService.searchAvailableUsmya(pickerSearch, currentUser.id);

    searchPromise
      .then((response) => setPickerUsers(response || []))
      .catch(() => setPickerUsers([]))
      .finally(() => setPickerLoading(false));
  }, [pickerOpen, pickerSearch, currentUser?.id, currentUser?.role]);

  const addOrJoinChat = async () => {
    if (!selectedPickerUser || !currentUser?.id) return;
    setLoading(true);
    setError('');
    try {
      const existingChats = await chatService.getChatsByUsmyaId(selectedPickerUser.id);
      let selectedChat = (existingChats || []).find((item) => item.tipo === chatType);
      if (!selectedChat) {
        selectedChat = await chatService.createChat({
          idUsmya: selectedPickerUser.id,
          tipo: chatType,
        });
      }

      const isInChat = await integrantesChatService.isUserInChat(selectedChat.id, currentUser.id);
      if (!isInChat) {
        await integrantesChatService.createIntegrante({
          idChat: selectedChat.id,
          idUser: currentUser.id,
        });
      }

      const rolePrefix = getRolePrefix(currentUser.role);
      navigate(`${rolePrefix}/chat-messages/${selectedChat.id}`);
    } catch (err) {
      setError(err.message || 'No se pudo abrir el chat.');
      setLoading(false);
    }
  };

  const rolePrefix = getRolePrefix(currentUser?.role);

  return (
    <PageShell
      title={chatType === 'tratante' ? 'Sala e.tratante' : 'Sala general'}
      subtitle="Chats donde participa el usuario actual"
      actions={
        <>
          <button className="btn btn-primary" type="button" onClick={() => setPickerOpen(true)}>
            Nuevo chat
          </button>
          <button className="btn" type="button" onClick={loadChats} disabled={loading}>
            Actualizar
          </button>
        </>
      }
    >
      {error ? <p className="error-text">{error}</p> : null}
      {!chats.length && !loading ? <p>No hay chats para mostrar.</p> : null}
      <div className="grid grid-2">
        {chats.map((chat) => (
          <article className="card" key={chat.id}>
            <h3>{chat.usmyaName}</h3>
            <p className="page-meta">Tipo: {chat.tipo}</p>
            {chat.usmyaAlias ? <p>Alias: {chat.usmyaAlias}</p> : null}
            {chat.lastMessage ? (
              <p className="page-meta">Ultimo: {chat.lastMessage.descripcion}</p>
            ) : (
              <p className="page-meta">Sin mensajes</p>
            )}
            <div className="actions-row">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => navigate(`${rolePrefix}/chat-messages/${chat.id}`)}
              >
                Abrir chat
              </button>
            </div>
          </article>
        ))}
      </div>

      <UserPickerModal
        open={pickerOpen}
        title="Seleccionar USMYA para chat"
        users={pickerUsers}
        loading={pickerLoading}
        search={pickerSearch}
        onSearchChange={setPickerSearch}
        selectedUser={selectedPickerUser}
        onSelect={setSelectedPickerUser}
        onConfirm={addOrJoinChat}
        onClose={() => {
          setPickerOpen(false);
          setSelectedPickerUser(null);
          setPickerSearch('');
        }}
        confirmLabel="Abrir chat"
      />

      {(loading || userLoading) && <LoadingOverlay message="Cargando chats..." />}
    </PageShell>
  );
}

export function ChatMessagesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, loading: userLoading } = useCurrentUser();

  const [chat, setChat] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const rolePrefix = getRolePrefix(currentUser?.role);

  const loadMessagesData = async (chatId) => {
    if (!chatId) return;
    setLoading(true);
    setError('');
    try {
      const [chatData, membersLinks, chatMessages] = await Promise.all([
        chatService.getChatById(chatId),
        integrantesChatService.getIntegrantesByChatId(chatId),
        mensajeService.getMensajesByChatIdOrdered(chatId),
      ]);

      const users = await Promise.all(
        (membersLinks || []).map((member) => usuarioService.getUserById(member.idUser)),
      );

      setChat(chatData);
      setParticipants(users.filter(Boolean));
      setMessages(chatMessages || []);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el chat.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadMessagesData(id);
      return;
    }

    async function redirectToFirstChat() {
      if (!currentUser?.id) return;
      setLoading(true);
      try {
        const memberships = await integrantesChatService.getChatsByUserId(currentUser.id);
        const firstId = memberships?.[0]?.idChat;
        if (firstId) navigate(`${rolePrefix}/chat-messages/${firstId}`, { replace: true });
      } catch {
        // Silent redirect fallback.
      } finally {
        setLoading(false);
      }
    }

    redirectToFirstChat();
  }, [id, currentUser?.id, rolePrefix]);

  const participantsMap = useMemo(() => {
    const map = new Map();
    participants.forEach((user) => map.set(Number(user.id), user));
    return map;
  }, [participants]);

  const sendMessage = async () => {
    if (!input.trim() || !chat?.id || !currentUser?.id) return;
    setSending(true);
    setError('');
    try {
      const now = new Date();
      await mensajeService.enviarMensaje({
        descripcion: input.trim(),
        idEmisor: currentUser.id,
        idChat: chat.id,
        fecha: now.toISOString().slice(0, 10),
        hora: now.toTimeString().slice(0, 5),
      });
      setInput('');
      await loadMessagesData(chat.id);
    } catch (err) {
      setError(err.message || 'No se pudo enviar el mensaje.');
    } finally {
      setSending(false);
    }
  };

  return (
    <PageShell
      title={chat ? `Chat ${chat.tipo}` : 'Mensajes'}
      subtitle={chat ? `USMYA ${chat.idUsmya}` : 'Conversacion'}
      actions={
        <button className="btn" type="button" onClick={() => navigate(`${rolePrefix}/chat-general`)}>
          Volver a chats
        </button>
      }
    >
      {error ? <p className="error-text">{error}</p> : null}
      <div className="chat-shell">
        <div className="chat-participants">
          <strong>Participantes</strong>
          <ul className="list-clean">
            {participants.map((user) => (
              <li key={user.id}>
                {user.nombre} <span className="page-meta">({user.email})</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="chat-messages-area">
          <div className="chat-messages-list">
            {messages.map((message) => {
              const sender = participantsMap.get(Number(message.idEmisor));
              const own = Number(message.idEmisor) === Number(currentUser?.id);
              return (
                <article className={`chat-message ${own ? 'own' : ''}`} key={message.id}>
                  <header>
                    <strong>{sender?.nombre || `Usuario ${message.idEmisor}`}</strong>
                    <span className="page-meta">
                      {formatDate(message.fecha)} {message.hora}
                    </span>
                  </header>
                  <p>{message.descripcion}</p>
                </article>
              );
            })}
          </div>

          <div className="chat-input-row">
            <textarea
              rows={2}
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button className="btn btn-primary" type="button" onClick={sendMessage} disabled={sending}>
              Enviar
            </button>
          </div>
        </div>
      </div>

      {(loading || sending || userLoading) && <LoadingOverlay message="Cargando chat..." />}
    </PageShell>
  );
}

