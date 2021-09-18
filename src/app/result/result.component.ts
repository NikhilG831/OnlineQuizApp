import { DataStoreService } from './../data-store.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit {
  isPassed = false;
  resultMsg = '';
  constructor(public _dService: DataStoreService) {}

  ngOnInit(): void {
    this.isPassed = this._dService.scored >= 70;
    this.resultMsg = this.isPassed
      ? 'Congratulations!! You Have Scored ' + this._dService.scored
      : 'Hard Luck !! You Have Scored  ' + this._dService.scored;
  }
}
