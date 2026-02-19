import React from 'react';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleRedirect from '../components/RoleRedirect';
import HomePage from '../pages/HomePage';
import { LoginPage } from '../pages/AuthPages';
import {
  AffectiveReferentPage,
  CommunityAgentPage,
  EfectorSaludPage,
  NeedHelpOtherPage,
  NeedHelpPage,
  NeedHelpUsmyaPage,
  OfferHelpPage,
  RegisterLandingPage,
  SpaceRegisterPage,
} from '../pages/RegisterPages';
import {
  AdminBenefitDetailPage,
  AdminBenefitsPage,
  AdminCalendarPage,
  AdminNotificationsActivitiesPage,
  AdminNotificationsPage,
  AdminSpacesPage,
} from '../pages/AdminPages';
import { AssistanceDetailsPage, AssistancePage, ParticipantFormPage } from '../pages/AssistancePages';
import {
  EfectorPatientsPage,
  ProfileSpacePage,
  ReferenteCompanionsPage,
  RegisterUsmyaPage,
  UsmyaProfilePage,
} from '../pages/ProfileAndPatientsPages';
import { AccompaniedPathPage, PatientPathPage, UsmyaPathPage } from '../pages/TrajectoryPages';
import { ChatListPage, ChatMessagesPage } from '../pages/ChatPages';

const withLayout = (element, roles) => (
  <ProtectedRoute roles={roles}>
    <AppLayout>{element}</AppLayout>
  </ProtectedRoute>
);

export const appRoutes = [
  { path: '/', element: <RoleRedirect /> },

  { path: '/login', element: <LoginPage /> },

  { path: '/registro', element: <RegisterLandingPage /> },
  { path: '/registro/necesito-ayuda', element: <NeedHelpPage /> },
  { path: '/registro/necesito-ayuda/usmya', element: <NeedHelpUsmyaPage /> },
  { path: '/registro/necesito-ayuda/otro', element: <NeedHelpOtherPage /> },
  { path: '/registro/ofrezco-ayuda', element: <OfferHelpPage /> },
  { path: '/registro/ofrezco-ayuda/efector-salud', element: <EfectorSaludPage /> },
  { path: '/registro/ofrezco-ayuda/agente-comunitario', element: <CommunityAgentPage /> },
  { path: '/registro/ofrezco-ayuda/referente-afectivo', element: <AffectiveReferentPage /> },
  { path: '/registro/ofrezco-ayuda/mi-institucion', element: <SpaceRegisterPage /> },

  { path: '/home', element: withLayout(<HomePage />, ['admin', 'agente', 'efector', 'referente', 'usmya']) },

  { path: '/admin/notificaciones', element: withLayout(<AdminNotificationsPage />, ['admin']) },
  {
    path: '/admin/notificaciones-actividades',
    element: withLayout(<AdminNotificationsActivitiesPage />, ['admin']),
  },
  { path: '/admin/espacios', element: withLayout(<AdminSpacesPage />, ['admin']) },
  { path: '/admin/recursero/calendario-semanal', element: withLayout(<AdminCalendarPage />, ['admin']) },
  { path: '/admin/recursero/prestaciones', element: withLayout(<AdminBenefitsPage />, ['admin']) },
  {
    path: '/admin/recursero/prestaciones/:id',
    element: withLayout(<AdminBenefitDetailPage />, ['admin']),
  },

  { path: '/agente/asistencia', element: withLayout(<AssistancePage />, ['agente']) },
  { path: '/agente/asistencia/detalles/:id', element: withLayout(<AssistanceDetailsPage />, ['agente']) },
  { path: '/agente/asistencia/ver-ficha/:id', element: withLayout(<ParticipantFormPage />, ['agente']) },
  { path: '/agente/registro-usmya', element: withLayout(<RegisterUsmyaPage />, ['agente']) },
  { path: '/agente/mi-institucion', element: withLayout(<ProfileSpacePage />, ['agente']) },
  { path: '/agente/chat-general', element: withLayout(<ChatListPage />, ['agente']) },
  { path: '/agente/chat-messages', element: withLayout(<ChatMessagesPage />, ['agente']) },
  { path: '/agente/chat-messages/:id', element: withLayout(<ChatMessagesPage />, ['agente']) },

  { path: '/efector/pacientes', element: withLayout(<EfectorPatientsPage />, ['efector']) },
  { path: '/efector/pacientes/nuevo-paciente', element: withLayout(<RegisterUsmyaPage />, ['efector']) },
  { path: '/efector/pacientes/ver-ficha/:id', element: withLayout(<ParticipantFormPage />, ['efector']) },
  { path: '/efector/pacientes/ver-trayectoria/:id', element: withLayout(<PatientPathPage />, ['efector']) },
  { path: '/efector/mi-institucion', element: withLayout(<ProfileSpacePage />, ['efector']) },
  { path: '/efector/chat-general', element: withLayout(<ChatListPage />, ['efector']) },
  { path: '/efector/chat-tratante', element: withLayout(<ChatListPage />, ['efector']) },
  { path: '/efector/chat-messages', element: withLayout(<ChatMessagesPage />, ['efector']) },
  { path: '/efector/chat-messages/:id', element: withLayout(<ChatMessagesPage />, ['efector']) },

  { path: '/referente/mis-acompanados', element: withLayout(<ReferenteCompanionsPage />, ['referente']) },
  {
    path: '/referente/mis-acompanados/ver-ficha/:id',
    element: withLayout(<ParticipantFormPage />, ['referente']),
  },
  {
    path: '/referente/mis-acompanados/ver-trayectoria/:id',
    element: withLayout(<AccompaniedPathPage />, ['referente']),
  },
  { path: '/referente/chat-general', element: withLayout(<ChatListPage />, ['referente']) },
  { path: '/referente/chat-messages', element: withLayout(<ChatMessagesPage />, ['referente']) },
  { path: '/referente/chat-messages/:id', element: withLayout(<ChatMessagesPage />, ['referente']) },

  { path: '/usmya/mi-perfil', element: withLayout(<UsmyaProfilePage />, ['usmya']) },
  { path: '/usmya/mi-trayectoria', element: withLayout(<UsmyaPathPage />, ['usmya']) },
];

