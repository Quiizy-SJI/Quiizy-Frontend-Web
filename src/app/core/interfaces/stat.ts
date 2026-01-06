import { TrendDirection } from "../../components/ui/cards/stat-card/stat-card.component";
import { ColorVariant } from "../../components/ui/types/component.types";

export interface Stat {
    label: string,
   value: number | string,
   description?: string,
   color: ColorVariant,
   icon?: string,
   showIcon: boolean,
   showTrend?: boolean,
   trendValue?: number | string,
   trendDirection?: TrendDirection,
   trendSuffix?: string,
   showProgress?: boolean,
   progress?: number,
   format?: 'number' | 'currency' | 'percent' | 'compact' | 'none',
   currencyCode?: string,
   compact?: boolean,
   customClass?: string,
    progressMax?: number;

}


export interface Department {
  name: string;
  head: string;
  teachingUnits: number;
  students: number;
  status: 'BALANCED' | 'OVER' | 'UNDER';
}

export interface Teacher {
  name: string;
  subjects: string[];
  classes: number;
  examCompletion: number;
  status: 'Healthy' | 'Review' | 'Action';
  phone?: string
  email: string;
}

export interface ExamStats {
  published: number;
  draft: number;
  scheduled: number;
}
