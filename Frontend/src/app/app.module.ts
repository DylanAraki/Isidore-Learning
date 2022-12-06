import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
    HorizontalTrailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
