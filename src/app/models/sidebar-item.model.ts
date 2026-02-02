export interface SidebarItem {
  label: string;
  icon: string;
  url: string;
  subsections?: SidebarItem[];
}