import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  pageIndex: number = 1;
  activePage: string =
    'flex items-center justify-center px-4 h-10 border hover:bg-blue-100 hover:text-blue-700 border-gray-700 bg-gray-200 text-blue-600 w-12 rounded-md';
  regularPage: string =
    'flex items-center justify-center px-4 h-10 leading-tight text-white hover:text-white w-12 rounded-md';
  arr: number[] = [];
  examId: number = 0;
  answers: string[] = [];
  exam: any;
  questionText: string = '';

  timeLeft: number = 5400;
  timerInterval: any;

  isExamEnded: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.exam = data['exam'];
    this.arr = this.exam.questions.map((x: any, i: any) => ++i);
    this.questionText = this.exam.questions[0].questionText;
    this.answers = this.exam.questions[0].choices;

    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.endExam();
      }
    }, 1000);
  }

  endExam() {
    clearInterval(this.timerInterval);
    this.isExamEnded = true;
    this.saveResponses();
    this.router.navigate(['/home']);
  }

  saveResponses() {
    console.log('Responses saved:', this.answers);
  }

  onPageClick(question: number) {
    this.pageIndex = question;
    this.questionText = this.exam.questions[this.pageIndex - 1].questionText;
    this.answers = this.exam.questions[this.pageIndex - 1].choices;
  }

  onNextClick() {
    if (this.pageIndex != this.exam.questions.length) {
      this.pageIndex++;
      this.questionText = this.exam.questions[this.pageIndex - 1].questionText;
      this.answers = this.exam.questions[this.pageIndex - 1].choices;
    }
  }

  onPreviousClick() {
    if (this.pageIndex != 1) {
      this.pageIndex--;
      this.questionText = this.exam.questions[this.pageIndex - 1].questionText;
      this.answers = this.exam.questions[this.pageIndex - 1].choices;
    }
  }

  preventArrowKeys(event: KeyboardEvent): void {
    if (
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${this.padTime(minutes)}:${this.padTime(seconds)}`;
  }

  private padTime(time: number): string {
    return time < 10 ? '0' + time : time.toString();
  }

  replaceDollarPairsRecursively(input: string): string {
    const firstIndex = input.indexOf('$');
    const secondIndex = input.indexOf('$', firstIndex + 1);

    if (firstIndex === -1 || secondIndex === -1 || firstIndex === secondIndex) {
      return input;
    }

    let markedString =
      input.slice(0, firstIndex) +
      '[OPEN]' +
      input.slice(firstIndex + 1, secondIndex) +
      '[CLOSE]' +
      input.slice(secondIndex + 1);

    markedString = markedString
      .replace('[OPEN]', '\\(')
      .replace('[CLOSE]', '\\)');

    return this.replaceDollarPairsRecursively(markedString);
  }
}
