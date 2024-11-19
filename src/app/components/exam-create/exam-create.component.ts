import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-exam-create',
  templateUrl: './exam-create.component.html',
  styleUrls: ['./exam-create.component.scss']
})
export class ExamCreateComponent {
  activeIndex: number = 0;
  examForm: FormGroup;
  categories: String[] = [
    'Тоон ба үсэгт илэрхийлэл',
    'Функц',
    'Тэгшитгэл ба тэнцэтгэл биш',
    'Дараалал',
    'Тригонометр',
    'Функцийн уламжлал',
    'Интеграл',
    'Координатын систем',
    'Вектор',
    'Хавтгайн геометр',
    'Огторгуйн геометр',
    'Магадлал статистик',
    'Комплекс тоо',
    'Матриц'
  ]

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.examForm = this.fb.group({
      examName: ['', Validators.required],
      duration: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      totalPoint: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      questions: this.fb.array([]),
    });
  }

  // Getter for questions FormArray
  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  getChoices(question: any): FormArray {
    return question.get('choices') as FormArray;
  }

  getQuestionText(index: any): FormControl {
    return this.questions.at(index).get('questionText') as FormControl
  }

  getQuestion(index: any): FormGroup {
    return this.questions.at(index) as FormGroup
  }

  // Create a new question form group
  createQuestion(): FormGroup {
    return this.fb.group({
      questionText: ['', Validators.required],
      choices: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
      ]),
      correctAnswer: ['', Validators.required],
      category: ['', Validators.required],
      questionPoint: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  // Add a new question
  addQuestion(): void {
    this.questions.push(this.createQuestion());
  }

  // Remove a question
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  // Add a choice to a specific question
  addChoice(questionIndex: number): void {
    const choices = this.questions.at(questionIndex).get('choices') as FormArray;
    choices.push(this.fb.control('', Validators.required));
  }

  // Remove a choice from a specific question
  removeChoice(questionIndex: number, choiceIndex: number): void {
    const choices = this.questions.at(questionIndex).get('choices') as FormArray;
    choices.removeAt(choiceIndex);
  }

  // Submit the form
  submit(): void {
    if (this.examForm.valid) {
      console.log(this.examForm.value);
      // Send form data to the backend
      const apiUrl = 'http://localhost:3000/exam/create'; // Update with your backend endpoint
      this.http.post(apiUrl, this.examForm.value).subscribe({
        next: (response) => {
          console.log('Exam created successfully', response);
        },
        error: (error) => {
          console.error('Error creating exam', error);
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }

  activeIndexChange(event: any) {
    // console.log(event);
    this.activeIndex = event;
  }
}
