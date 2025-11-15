import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/chat',
    pathMatch: 'full'
  },
  {
    path: 'chat',
    loadComponent: () => import('./components/chat-container/chat-container.component').then(m => m.ChatContainerComponent)
  }
];

