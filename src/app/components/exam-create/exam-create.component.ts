import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-exam-create',
  templateUrl: './exam-create.component.html',
  styleUrls: ['./exam-create.component.scss']
})
export class ExamCreateComponent {
  isLoading: boolean = false;
  isFinished: boolean = false;
  activeIndex: number = 0;
  examForm: FormGroup;
  isEditMode: boolean = false;
  examId: string | null = null;

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
  answerTypes: any[] = [
    { label: 'Тест', value: 'test' },
    { label: 'Нөхөх хэсэг', value: 'fill' },
  ]

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private msg: MessageService,
    private route: ActivatedRoute,
  ) {
    this.examForm = this.fb.group({
      examName: ['', Validators.required],
      duration: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      totalPoint: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    // Check if the route contains an ID
    this.route.paramMap.subscribe(params => {
      this.examId = params.get('id');
      this.isEditMode = !!this.examId;

      if (this.isEditMode) {
        this.loadExamDetails(this.examId!);
      }
    });
  }

  loadExamDetails(id: string): void {
    const apiUrl = `http://localhost:3000/exam/admin/${id}`; // Update with your endpoint
    this.http.get<any>(apiUrl).subscribe({
      next: (exam) => {
        // Patch form with exam details
        this.examForm.patchValue({
          examName: exam.examName,
          duration: exam.duration,
          totalPoint: exam.totalPoint,
        });

        // Add questions to the form
        exam.questions.forEach((question: any) => {
          const questionGroup = this.createQuestion();
          questionGroup.patchValue({
            _id: question._id,
            questionText: question.questionText,
            correctAnswer: question.correctAnswer,
            category: question.category,
            answerType: question.answerType,
            questionPoint: question.questionPoint,
          });

          // Add choices
          const choicesArray = questionGroup.get('choices') as FormArray;
          question.choices.forEach((choice: string) => {
            choicesArray.push(this.fb.control(choice, Validators.required));
          });

          this.questions.push(questionGroup);
        });
      },
      error: (error) => {
        console.error('Error loading exam details:', error);
        this.msg.add({
          severity: 'error',
          summary: 'Алдаа',
          detail: 'Шалгалтын мэдээллийг унших үед алдаа гарлаа',
        });
      }
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

  getAnswerType(index: any): FormControl {
    return this.questions.at(index).get('answerType') as FormControl
  }

  onAnswerTypeChange(event: DropdownChangeEvent, index: number) {
    if (event.value === 'fill') {
      const formArray = this.questions.at(index).get('choices') as FormArray
      formArray.clear();
    }
  }

  // Create a new question form group
  createQuestion(): FormGroup {
    return this.fb.group({
      _id: null,
      questionText: ['', Validators.required],
      choices: this.isEditMode
        ? this.fb.array([])
        : this.fb.array([
          this.fb.control('', Validators.required),
          this.fb.control('', Validators.required),
        ]),
      correctAnswer: ['', Validators.required],
      category: ['', Validators.required],
      answerType: ['', Validators.required],
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
    this.isLoading = true;
    if (this.examForm.valid) {
      this.isFinished = true;
      // Send form data to the backend
      const apiUrl = this.isEditMode
        ? `http://localhost:3000/exam/update/${this.examId}` // Update endpoint
        : 'http://localhost:3000/exam/create'; // Create endpoint
      this.http.post(apiUrl, this.examForm.value).subscribe({
        next: (response) => {
          console.log('Exam created successfully', response);
          this.isLoading = false;
          this.msg.add({
            severity: 'success',
            summary: 'Амжилттай',
            detail: 'Амжилттай хадгаллаа',
          });
          this.router.navigate(['home']);
        },
        error: (error) => {
          console.error('Error creating exam', error);
          this.isLoading = false;
          this.msg.add({
            severity: 'error',
            summary: 'Алдаа',
            detail: 'Хадгалах үед алдаа гарлаа',
          });
        },
      });
    } else {
      this.msg.add({
        severity: 'warn',
        summary: 'Анхааруулга',
        detail: 'Бүх талбарыг бөглөнө үү',
      });
      Object.keys(this.examForm.controls).forEach(control => {
        this.examForm.controls[control].markAsDirty();
        this.examForm.controls[control].markAllAsTouched();
      })
      for (let control of this.questions.controls) {
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach(key => {
            control.get(key)?.markAllAsTouched();
            control.get(key)?.markAsDirty();
          })
        } else {
          control.markAllAsTouched();
          control.markAsDirty();
        }
      }
      this.examForm.markAsDirty();
      console.error('Form is invalid');
    }
  }

  activeIndexChange(event: any) {
    // console.log(event);
    this.activeIndex = event ?? this.activeIndex;
  }
}
