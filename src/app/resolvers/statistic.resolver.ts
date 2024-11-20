import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { StatisticService } from '../services/statistic.service';

export const statisticResolver: ResolveFn<Object> = (route, state) => {
  return inject(StatisticService).getStatistic();
};
