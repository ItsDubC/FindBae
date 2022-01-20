import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrModule } from 'ngx-toastr';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right'
    }),
    NgxGalleryModule,
    NgxSpinnerModule,
    FileUploadModule
  ],
  exports: [
    BsDropdownModule,
    BsDatepickerModule,
    TabsModule,
    ToastrModule,
    NgxGalleryModule,
    NgxSpinnerModule,
    FileUploadModule
  ]
})
export class ThirdPartyModule { }
