import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public toogleSidebar: BehaviorSubject<string> = new BehaviorSubject<string>(
    localStorage.getItem('sidebarPosition') === 'true' ? 'true' : 'false'
  );
  public showDark: BehaviorSubject<string | boolean> = new BehaviorSubject<string | boolean>(
    localStorage.getItem('isDarkTheme') || false
  );
  public themeMode: BehaviorSubject<string> = new BehaviorSubject<string>(
    localStorage.getItem('themeMode') || 'light_mode'
  );

  public openSidebar(): void {
    // to set sidebar position app component html using "menu-opened" class
    if (localStorage.getItem('sidebarPosition')) {
      localStorage.removeItem('sidebarPosition');
      this.toogleSidebar.next('false');
    } else {
      localStorage.setItem('sidebarPosition', 'true');
      this.toogleSidebar.next('true');
    }
  }

  public closeSidebar(): void {
    // hide sidebar
    this.toogleSidebar.next('false');
    localStorage.removeItem('sidebarPosition');
  }

  public themeColor(): void {
    if (localStorage.getItem('isDarkTheme')) {
      this.showDark.next("false");
      localStorage.removeItem('isDarkTheme');
    } else {
      this.showDark.next('true');
      localStorage.setItem('isDarkTheme', 'true');
    }
  }

}
