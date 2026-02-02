import { Routes } from '@angular/router';

import { RegisterPageComponent } from './pages/register/register-page.component';
import { OfferHelpPageComponent } from './pages/register/offer-help/offer-help-page.component';
import { EfectorSalud } from './pages/register/efector-salud/efector-salud';
import { CommunityAgent } from './pages/register/community-agent/community-agent';
import { NeedHelp } from './pages/register/need-help/need-help';
import { AffectiveReferent } from './pages/register/affective-referent/affective-referent';
import { NeedHelpUsmya } from './pages/register/need-help-usmya/need-help-usmya';
import { NeedHelpOtherComponent } from './pages/register/need-help-other/need-help-other';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Notifications } from './pages/admin/notifications/notifications';
import { NotificationsActivities } from './pages/admin/notifications/notifications-activities/notifications-activities';
import { Calendar } from './pages/admin/resourceful/calendar/calendar';
import { Benefits } from './pages/admin/resourceful/benefits/benefits';
import { Detail } from './pages/admin/resourceful/benefits/detail/detail';
import { SpacesListComponent } from './pages/admin/spaces/spaces-list/spaces-list.component';
import { Activities } from './pages/agent/activities/activities';
import { RegisterUsmya } from './pages/agent/register-usmya/register-usmya';
import { MyProfile } from './pages/usmya/my-profile/my-profile';
import { MyCompanions } from './pages/referent/my-companions/my-companions';
import { MisPacientes } from './pages/agent/mis-pacientes/mis-pacientes';

// Guards
import { RoleGuard } from './guards/role.guard';
import { AdminGuard } from './guards/admin.guard';
import { ReferenteGuard } from './guards/referente.guard';
import { UsmyaGuard } from './guards/usmya.guard';
import { AgenteGuard } from './guards/agente.guard';
import { EfectorGuard } from './guards/efector.guard';
import { Assistance } from './pages/agent/assistance/assistance';
import { Details } from './pages/agent/assistance/details/details';
import { ParticipantForm } from './pages/agent/assistance/participant-form/participant-form';
import { ProfileSpace } from './pages/agent/profile-space/profile-space';
import { MyPatients } from './pages/agent/my-patients/my-patients';
import { PathPatient } from './pages/agent/my-patients/path-patient/path-patient';
import { PathAccompanied } from './pages/referent/my-companions/path-accompanied/path-accompanied';
import { AccompaniedForm } from './pages/referent/my-companions/accompanied-form/accompanied-form';
import { Path } from './pages/usmya/path/path';
import { Chat } from './pages/agent/chat/chat';
import { MessagesChat } from './pages/agent/messages-chat/messages-chat';
import { NewPatient } from './pages/agent/my-patients/new-patient/new-patient';
import { Space } from './pages/register/space/space';

export const routes: Routes = [
	{ path: '', canActivate: [RoleGuard], component: Home }, // Redirige según rol


	{ path: 'admin/espacios', component: SpacesListComponent, canActivate: [AdminGuard] },
	// { path: 'agente/actividades', component: Activities, canActivate: [AgenteGuard] },
	{ path: 'agente/asistencia', component: Assistance, canActivate: [AgenteGuard] },
	{ path: 'agente/asistencia/detalles/:id', component: Details, canActivate: [AgenteGuard] },
	{ path: 'agente/asistencia/ver-ficha/:id', component: ParticipantForm, canActivate: [AgenteGuard] },
	{ path: 'agente/registro-usmya', component: RegisterUsmya, canActivate: [AgenteGuard] },
	{ path: 'agente/mi-institucion', component: ProfileSpace, canActivate: [AgenteGuard] },
	{ path: 'agente/chat-general', component: Chat, canActivate: [AgenteGuard] },
	{ path: 'agente/chat-messages/:id', component: MessagesChat, canActivate: [AgenteGuard] },


	// { path: 'efector/actividades', component: Activities, canActivate: [EfectorGuard] },
	// { path: 'efector/asistencia', component: Assistance, canActivate: [EfectorGuard] },
	// { path: 'efector/asistencia/detalles/:id', component: Details, canActivate: [EfectorGuard] },
	// { path: 'efector/asistencia/ver-ficha/:id', component: ParticipantForm, canActivate: [EfectorGuard] },
	{ path: 'efector/pacientes', component: MyPatients, canActivate: [EfectorGuard] },
	{ path: 'efector/pacientes/ver-trayectoria/:id', component: PathPatient, canActivate: [EfectorGuard] },
	{ path: 'efector/pacientes/ver-ficha/:id', component: ParticipantForm, canActivate: [EfectorGuard] },
	{ path: 'efector/pacientes/nuevo-paciente', component: NewPatient, canActivate: [EfectorGuard] },
	{ path: 'efector/mi-institucion', component: ProfileSpace, canActivate: [EfectorGuard] },
	{ path: 'efector/chat-general', component: Chat, canActivate: [EfectorGuard] },
	{ path: 'efector/chat-tratante', component: Chat, canActivate: [EfectorGuard] },
	{ path: 'efector/chat-messages', component: MessagesChat, canActivate: [EfectorGuard] },
	{ path: 'efector/chat-messages/:id', component: MessagesChat, canActivate: [EfectorGuard] },


	{ path: 'admin/notificaciones', component: Notifications, canActivate: [AdminGuard] },
	{ path: 'admin/notificaciones-actividades', component: NotificationsActivities, canActivate: [AdminGuard] },
	{ path: 'admin/recursero/calendario-semanal', component: Calendar, canActivate: [AdminGuard] },
	{ path: 'admin/recursero/prestaciones', component: Benefits, canActivate: [AdminGuard] },
    { path: 'admin/recursero/prestaciones/:id', component: Detail, canActivate: [AdminGuard] },


	{ path: 'registro', component: RegisterPageComponent },
	{ path: 'registro/necesito-ayuda', component: NeedHelp },
	{ path: 'registro/necesito-ayuda/usmya', component: NeedHelpUsmya },
	{ path: 'registro/necesito-ayuda/otro', component: NeedHelpOtherComponent },
	{ path: 'registro/ofrezco-ayuda', component: OfferHelpPageComponent },
	{ path: 'registro/ofrezco-ayuda/efector-salud', component: EfectorSalud },
	{ path: 'registro/ofrezco-ayuda/agente-comunitario', component: CommunityAgent },
	{ path: 'registro/ofrezco-ayuda/referente-afectivo', component: AffectiveReferent },
	{ path: 'registro/ofrezco-ayuda/mi-institucion', component: Space },

	{ path: 'login', component: Login },


	{ path: 'usmya/mi-perfil', component: MyProfile, canActivate: [UsmyaGuard] },
	{ path: 'usmya/mi-trayectoria', component: Path, canActivate: [UsmyaGuard] },


	{ path: 'referente/mis-acompañados', component: MyCompanions, canActivate: [ReferenteGuard] },
	{ path: 'referente/mis-acompañados/ver-trayectoria/:id', component: PathAccompanied, canActivate: [ReferenteGuard] },
	{ path: 'referente/mis-acompañados/ver-ficha/:id', component: AccompaniedForm, canActivate: [ReferenteGuard] },
	{ path: 'referente/chat-general', component: Chat, canActivate: [ReferenteGuard] },
	{ path: 'referente/chat-messages', component: MessagesChat, canActivate: [ReferenteGuard] },
	{ path: 'referente/chat-messages/:id', component: MessagesChat, canActivate: [ReferenteGuard] }
	
];
