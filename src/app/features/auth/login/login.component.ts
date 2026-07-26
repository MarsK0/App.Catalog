import { Component, inject, signal } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AuthService } from '../../../core/auth/auth.service';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationService } from '../../../shared/services/navigation.service';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HlmCardImports, HlmInputImports, HlmFieldImports, HlmSwitchImports, HlmButtonImports, HlmSpinnerImports, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent{
  private readonly _authService = inject(AuthService);
  private readonly _navService = inject(NavigationService);

  protected readonly loading = signal<boolean>(false);

  protected readonly form = new FormGroup<LoginForm>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)]
    }),
    rememberMe: new FormControl(false, { nonNullable: true })
  });

  protected onSubmit(): void {
    if(this.form.invalid || this.loading()) return;

    this.loading.set(true);

    const loginData = this.form.getRawValue();

    this._authService.login(loginData).subscribe({
      next: response => {
        this._navService.navigate(['/']);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}