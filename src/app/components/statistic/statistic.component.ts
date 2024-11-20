import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent {
  statistic: any[] = [];
  basicData: any;
  basicOptions: any;
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
  ];

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.statistic = this.activatedRoute.snapshot.data['statistic'];
    console.log(this.statistic);
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--bluegray-800');
    const textColorSecondary = documentStyle.getPropertyValue('--bluegray-700');
    const surfaceBorder = documentStyle.getPropertyValue('--bluegray-100');

    this.basicData = {
      labels: this.statistic.map(stat => stat.category),
      datasets: [
        {
          label: 'Niit',
          data: this.statistic.map(stat => stat.percentage),
          backgroundColor: ['rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgb(255, 159, 64)'],
          borderWidth: 1
        },
      ]
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
}
