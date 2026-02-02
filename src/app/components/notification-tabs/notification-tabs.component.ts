import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

export interface NotificationTab {
  label: string;
  icon: string;
  count?: number;
  value: string;
}

@Component({
  selector: 'app-notification-tabs',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './notification-tabs.component.html',
  styleUrls: ['./notification-tabs.component.scss']
})
export class NotificationTabsComponent implements OnInit {
  @Input() tabs: NotificationTab[] = [];
  @Input() tabCounts: { [key: string]: number } = {};
  @Input() showCount: boolean = true;
  @Input() showSummary: boolean = true;
  @Input() activeTab: string = '';
  @Output() tabChange = new EventEmitter<string>();

  selectedTabIndex = 0;

  defaultTabs: NotificationTab[] = [
    {
      label: 'Agentes',
      icon: '👥',
      value: 'agente'
    },
    {
      label: 'Referentes',
      icon: '🎯',
      value: 'referente'
    },
    {
      label: 'Usmyas',
      icon: '🏥',
      value: 'usmya'
    }
  ];

  ngOnInit(): void {
    if (this.tabs.length === 0) {
      this.tabs = this.defaultTabs;
    }
    if (this.activeTab) {
      const index = this.tabs.findIndex(tab => tab.value === this.activeTab);
      if (index !== -1) {
        this.selectedTabIndex = index;
      }
    }
  }

  onTabChange(index: number): void {
    const selectedTab = this.tabs[index];
    if (selectedTab) {
      this.selectedTabIndex = index;
      this.tabChange.emit(selectedTab.value);
    }
  }

  getTotalCount(): number {
    return Object.values(this.tabCounts).reduce((sum, count) => sum + count, 0);
  }
}