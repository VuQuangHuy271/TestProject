import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { CookDetailComponent } from './cook/components/cook-detail/cook-detail.component';
import { DanhSachCongThucCookComponent } from './cook/components/danh-sach-cong-thuc-cook/danh-sach-cong-thuc-cook.component';
import { RouterModule, Routes  } from '@angular/router';


const appRoutes: Routes = [
  { path: '', component: DanhSachCongThucCookComponent },
  { path: 'detail', component: CookDetailComponent },
  { path: 'DanhSachCongThucCook', component: DanhSachCongThucCookComponent }
]

@NgModule({
  
  declarations: [
    AppComponent,
    CookDetailComponent,
    DanhSachCongThucCookComponent
  ],
  imports: [
    BrowserModule,
    GraphQLModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
