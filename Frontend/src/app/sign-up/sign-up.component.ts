import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  username!: FormControl;
  email!: FormControl;
  password!: FormControl;
  confirmPassword!: FormControl;
  verificationCode!: FormControl;
  errorMessage: string | null = null;
  showPassword: boolean = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    // Initialize form controls
    this.username = this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
      // Add custom validator to check for special characters and whitespace
      Validators.pattern('^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$'),
      // Add custom validator to check if username is taken
      this.checkUsernameTaken.bind(this)
    ]);
    this.email = this.formBuilder.control('', [
      Validators.required,
      Validators.email,
      // Add custom validator to check if email is taken
      this.checkEmailTaken.bind(this)
    ]);
    this.password = this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(8),
      // Add custom validators to check for password requirements
      this.checkPasswordContainsNumber.bind(this),
      this.checkPasswordContainsSpecialCharacter.bind(this),
      this.checkPasswordContainsUppercaseLetter.bind(this),
      this.checkPasswordContainsLowercaseLetter.bind(this)
    ]);
    this.confirmPassword = this.formBuilder.control('', [
      Validators.required,
      // Add custom validator to check if passwords match
      this.checkPasswordsMatch.bind(this)
    ]);
    this.verificationCode = this.formBuilder.control('', [
      Validators.required,
      // Add custom validator to check if verification code is valid
      this.checkVerificationCode.bind(this)
    ]);

    // Initialize form group
    this.signUpForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      verificationCode: this.verificationCode
    });
  }


  checkUsernameTaken(control: FormControl) {
    // Call service function to check if username is taken
    if (this.authService.checkUsernameTaken(control.value)) {
      return { usernameTaken: true };
    }
    return null;
  }

  // Custom validator to check if email is taken
  checkEmailTaken(control: FormControl) {
    // Call service function to check if email is taken
    if (this.authService.checkEmailTaken(control.value)) {
      return { emailTaken: true };
    }
    return null;
  }

  // Custom validator to check if password contains a number
  checkPasswordContainsNumber(control: FormControl) {
    if (!/\d/.test(control.value)) {
      return { passwordDoesNotContainNumber: true };
    }
    return null;
  }

  // Custom validator to check if password contains a special character
  checkPasswordContainsSpecialCharacter(control: FormControl) {
    if (!/[^A-Za-z0-9]/.test(control.value)) {
      return { passwordDoesNotContainSpecialCharacter: true };
    }
    return null;
  }

  // Custom validator to check if password contains an uppercase letter
  checkPasswordContainsUppercaseLetter(control: FormControl) {
    if (!/[A-Z]/.test(control.value)) {
      return { passwordDoesNotContainUppercaseLetter: true };
    }
    return null;
  }

  // Custom validator to check if password contains a lowercase letter
  checkPasswordContainsLowercaseLetter(control: FormControl) {
    if (!/[a-z]/.test(control.value)) {
      return { passwordDoesNotContainLowercaseLetter: true };
    }
    return null;
  }

  // Custom validator to check if passwords match
  checkPasswordsMatch(control: FormControl) {
    if (control.value !== this.password.value) {
      return { passwordsDoNotMatch: true };
    }
    return null;
  }

  // Custom validator to check if verification code is valid
  checkVerificationCode(control: FormControl) {
    // Call service function to check if verification code is valid
    if (!this.authService.checkVerificationCode(control.value)) {
      return { invalidVerificationCode: true };
    }
    return null;
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      // Call service function to sign up with form values
      this.authService.signUp(this.signUpForm.value).subscribe(
        () => {
          // Navigate to home page on successful sign up
          this.router.navigate(['/']);
        },
        error => {
          // Display error message
          this.errorMessage = error.message;
        }
      );
    }
  }

}
