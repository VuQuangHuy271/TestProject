import { Component, OnInit } from '@angular/core';
import { CookService } from '../../services/cook.services';

@Component({
  selector: 'app-danh-sach-cong-thuc-cook',
  templateUrl: './danh-sach-cong-thuc-cook.component.html',
  styleUrls: ['./danh-sach-cong-thuc-cook.component.css']
})
export class DanhSachCongThucCookComponent implements OnInit {

  data: any;
  constructor(private cookService: CookService,) { }
  
  ngOnInit(): void {
    this.data = this.cookService.getListCook()
    console.log(this.data)
    let data1 = this.cookService.getListCookByID(1)
  }

}
