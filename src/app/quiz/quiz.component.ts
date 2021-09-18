import { DataStoreService } from './../data-store.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as sampleData from '../dummy-data.json';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  min = 5;
  second = 0;
  duration = 5 * 60 * 1000;
  // duration = 10000;
  endDateTime: number;
  interval: any;
  passPercentage = 70;

  quizForm: FormGroup;
  questionList: any = sampleData.questionArray;

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private _dService: DataStoreService
  ) {}

  ngOnInit(): void {
    this.setUpTimer();
    this.setupQuizFormArray();
  }

  setupQuizFormArray() {
    this.quizForm = this._fb.group({
      quizFormArray: this._fb.array([]),
    });

    for (const question of this.questionList) {
      this.addQuestion(question);
    }
  }

  get quizFormArray() {
    return this.quizForm.get('quizFormArray') as FormArray;
  }

  onSubmit() {
    console.log('complete', this.quizFormArray.value);
    let correct = 0;
    for (const submittedValue of this.quizFormArray.value) {
      if (submittedValue.selection === submittedValue.answer) {
        correct++;
      }
    }
    this._dService.scored = (correct / this.quizFormArray.value.length) * 100;
    this.router.navigate(['result']);
  }

  addQuestion(questionObj) {
    const questionGroup = this._fb.group({
      question: [questionObj.text],
      options: [questionObj.options],
      selection: [''],
      answer: [questionObj.answer],
    });
    this.quizFormArray.push(questionGroup);
    console.log(this.quizFormArray.controls);
  }

  setUpTimer() {
    const currentDate = new Date();
    this.endDateTime = currentDate.getTime() + this.duration;
    this.interval = setInterval(() => {
      this.updateTimer(this.endDateTime - currentDate.getTime());
    }, 1000);
  }

  updateTimer(timeDiff) {
    this.second = Math.floor((timeDiff / 1000) % 60);
    this.min = Math.floor((timeDiff / (1000 * 60)) % 60);
    this.endDateTime -= 1000;
    if (this.min === 0 && this.second === 0) {
      clearInterval(this.interval);
      this.onSubmit();
    }
  }

  getTimer() {
    return `${this.min} minutes ${this.second} seconds`;
  }
}
