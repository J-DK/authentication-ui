import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from './features/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'authentication-ui';

   constructor(private authService: AuthService,
              private router: Router) { }

   logout() {
      this.authService.logout();
      window.location.reload();
    }
}
