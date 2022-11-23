import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../cognito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //TODO: Okay, for tomorrow, the first thing I should do is get the unique user. The rest of the login stuff can be delayed. Detecting the presence
  //of a user will be enough to start out. Note that this may be worth doing in App Component. Once it is, I can make the apperance of the login
  //and logout conditional, organizing the header better. Then, I can commit and focus on maps. This is good enough for the time being.
  //I can then clean up the user stuff later.
}
