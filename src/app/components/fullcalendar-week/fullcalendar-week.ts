import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Actividad } from '../../models/actividad.model';

@Component({
  selector: 'app-fullcalendar-week',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './fullcalendar-week.html',
  styleUrl: './fullcalendar-week.scss'
})
export class FullcalendarWeek implements OnInit, OnChanges {
  @Input() activities: Actividad[] = [];
  @Output() activityClick = new EventEmitter<number>();

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'today'
    },
    slotMinTime: '07:00:00',
    slotMaxTime: '24:00:00',
    allDaySlot: false,
    slotDuration: '01:00:00',
    slotLabelInterval: '01:00:00',
    height: 'auto',
    contentHeight: 'auto',
    expandRows: false,
    nowIndicator: true,
    editable: false,
    selectable: false,
    selectMirror: false,
    dayMaxEvents: false, // Mostrar todos los eventos sin limitación
    weekends: true,
    firstDay: 1, // Lunes como primer día
    slotEventOverlap: false, // Los eventos superpuestos se muestran lado a lado
    eventMaxStack: 3, // Máximo de eventos apilados
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    dayHeaderFormat: {
      weekday: 'short', // Cambiar de 'long' a 'short' para días más compactos
      day: 'numeric',
      omitCommas: true
    },
    views: {
      timeGridWeek: {
        titleFormat: { year: 'numeric', month: 'long' }
      }
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventMouseEnter: this.handleEventMouseEnter.bind(this),
    eventMouseLeave: this.handleEventMouseLeave.bind(this),
    eventContent: this.renderEventContent.bind(this)
  };

  ngOnInit() {
    this.updateCalendarEvents();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activities'] && !changes['activities'].firstChange) {
      this.updateCalendarEvents();
    }
  }

  // Transformar actividades a eventos de FullCalendar
  private updateCalendarEvents() {
    const events: EventInput[] = this.activities.map(activity => {
      const activityDate = new Date(activity.dia);
      const [hours, minutes] = activity.hora.split(':');
      
      // Crear fecha/hora de inicio
      const startDate = new Date(activityDate);
      startDate.setHours(parseInt(hours), parseInt(minutes), 0);
      
      // Crear fecha/hora de fin
      const endDate = new Date(activityDate);
      if (activity.horaFin) {
        // Si tiene hora de fin, usarla
        const [endHours, endMinutes] = activity.horaFin.split(':');
        endDate.setHours(parseInt(endHours), parseInt(endMinutes), 0);
      } else {
        // Si no tiene hora de fin, usar 1 hora después por defecto
        endDate.setHours(parseInt(hours) + 1, parseInt(minutes), 0);
      }

      return {
        id: activity.id?.toString(),
        title: activity.nombre,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        backgroundColor: this.getActivityColor(activity.espacioId),
        borderColor: this.getActivityColor(activity.espacioId),
        extendedProps: {
          lugar: activity.lugar,
          responsable: activity.responsable,
          descripcion: activity.descripcion,
          espacioId: activity.espacioId
        }
      };
    });

    this.calendarOptions = {
      ...this.calendarOptions,
      events
    };
  }

  // Obtener color según espacioId
  private getActivityColor(espacioId: number): string {
    const colors = [
      '#3362D9', // Azul primario
      '#3DCF9E', // Verde secundario
      '#FFB84D', // Naranja
      '#FF6B9D', // Rosa
      '#9B7EDE', // Morado
      '#4ECDC4', // Turquesa
      '#F7B731'  // Amarillo
    ];
    
    return colors[espacioId % colors.length];
  }

  // Manejar click en evento
  private handleEventClick(clickInfo: any) {
    const event = clickInfo.event;
    const activityId = parseInt(event.id);
    
    if (activityId) {
      this.activityClick.emit(activityId);
    }
  }

  // Manejar hover sobre evento
  private handleEventMouseEnter(mouseEnterInfo: any) {
    const el = mouseEnterInfo.el;
    el.style.zIndex = '1000';
    el.style.transform = 'scale(1.02)';
  }

  private handleEventMouseLeave(mouseLeaveInfo: any) {
    const el = mouseLeaveInfo.el;
    el.style.zIndex = '';
    el.style.transform = '';
  }

  // Renderizar contenido personalizado del evento
  private renderEventContent(eventInfo: any) {
    const event = eventInfo.event;
    const props = event.extendedProps;
    
    return {
      html: `
        <div class="fc-event-custom">
          <div class="fc-event-custom__title">${event.title}</div>
          <div class="fc-event-custom__space">${props.lugar}</div>
        </div>
      `
    };
  }
}
