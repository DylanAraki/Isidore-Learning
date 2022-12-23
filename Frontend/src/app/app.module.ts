import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar'; 

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { RegisterComponent } from './register/register.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { PathAttributePipe } from './path-attribute.pipe';
import { LineOptionsComponent } from './line-options/line-options.component';
import { LegendComponent } from './legend/legend.component';
import { VerticalTrailComponent } from './vertical-trail/vertical-trail.component';
import { HorizontalTrailComponent } from './horizontal-trail/horizontal-trail.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';


import { QuillModule } from 'ngx-quill';
import { MathliveBlot } from './math-live-blot'
import { PathLinkBlot } from './path-link-blot';
import { EditOptionsComponent } from './edit-options/edit-options.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    RegisterComponent,
    EditComponent,
    ViewComponent,
    PathAttributePipe,
    LineOptionsComponent,
    LegendComponent,
    VerticalTrailComponent,
    HorizontalTrailComponent,
    EditOptionsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    QuillModule,
    ReactiveFormsModule,
    MatToolbarModule
  ],
  providers: [MathliveBlot, PathLinkBlot],
  bootstrap: [AppComponent]
})
export class AppModule { }
