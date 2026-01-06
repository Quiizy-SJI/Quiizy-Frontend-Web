import { Component } from '@angular/core';
import { ExamType, MiniAdmin } from '../../../core/interfaces/mini-admin';
import { ThemeService } from '../../../core/services';
import { Sidebar } from "../../../components/sidebar/sidebar";
import { Header } from "../../../components/header/header";
import { ExamTypesTable } from "../../../components/exam-types-table/exam-types-table";
import { MiniAdminsTable } from "../../../components/mini-admins-table/mini-admins-table";
import { WeightDistribution } from "../../../components/weight-distribution/weight-distribution";

@Component({
  selector: 'app-exam-types-minis',
  imports: [Sidebar, Header, ExamTypesTable, MiniAdminsTable, WeightDistribution],
  templateUrl: './exam-types-minis.html',
  styleUrl: './exam-types-minis.scss',
})
export class ExamTypesMinis {
examTypes: ExamType[] = [
    {
      type: 'Mid-term (CC)',
      weight: '25%',
      anonymous: true,
      autoPublish: true,
      status: 'Active'
    },
    {
      type: 'Final (SN)',
      weight: '60%',
      anonymous: false,
      autoPublish: true,
      status: 'Active'
    },
    {
      type: 'Mock Practice',
      weight: 'Excluded',
      anonymous: true,
      autoPublish: false,
      status: 'Draft'
    }
  ];

  miniAdmins: MiniAdmin[] = [
    {
      name: 'Sarah Noumba',
      department: 'Information Systems',
      classes: 12,
      students: 320,
      status: 'ACTIVE',
      access: {
        department: 'Information Systems',
        info: 'Permissions: Create exams'
      },
      permissions: ['Create exams', 'Grade submissions']
    },
    {
      name: 'Joel Tchagna',
      department: 'Cybersecurity',
      classes: 9,
      students: 210,
      status: 'PENDING',
      access: {
        department: 'Cybersecurity',
        info: '2FA pending: Remind to enable'
      }
    },
    {
      name: 'Invite placeholder',
      department: 'Unassigned',
      classes: 0,
      students: 0,
      status: 'INVITE'
    }
  ];

  weightDistribution = [
    { label: '60% Finals', percentage: 60, color: '#6366f1' },
    { label: '25% Mid-term', percentage: 25, color: '#10b981' },
    { label: '15% Projects', percentage: 15, color: '#f59e0b' }
  ];

  globalRules = [
    {
      title: 'Anonymous grading',
      description: 'Default: Enabled',
      enabled: true
    },
    {
      title: 'Randomize questions',
      description: 'Per exam override allowed',
      enabled: true
    }
  ];

  constructor(public themeService: ThemeService) {}

  onAddType() {
    console.log('Add new exam type');
  }

  onEditType(type: ExamType) {
    console.log('Edit exam type:', type);
  }

  onManageAdmin(admin: MiniAdmin) {
    console.log('Manage admin:', admin);
  }

  onRemindAdmin(admin: MiniAdmin) {
    console.log('Remind admin:', admin);
  }

  onInviteAdmin() {
    console.log('Invite new admin');
  }

  onToggleRule(rule: any) {
    console.log('Toggle rule:', rule);
  }
}
