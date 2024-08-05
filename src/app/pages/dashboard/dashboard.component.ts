import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTable } from '@angular/material/table'
import { DashboardDataSource, DashboardItem } from './dashboard-datasource'
import { DashboardService } from 'src/app/shared/services/dashboard/dashboard.service'
import { TaskService } from 'src/app/shared/services/task/task.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild(MatTable) table!: MatTable<DashboardItem>
  dataSource: DashboardDataSource
  data: DashboardItem[] = []

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'date',
    'project',
    'description',
    'hours',
    'status',
    'hourly-amount',
    'currency',
    'usd-amount',
    'cost-amount'
  ];

  constructor(private readonly dashboardService: DashboardService, private readonly taskService: TaskService) {
    this.dataSource = new DashboardDataSource(this.dashboardService)
  }

  ngOnInit(): void {
    this.taskService.taskAdded.subscribe(() => {
      this.dashboardService.getDashboardData().then((data) => {
        data.forEach((item: DashboardItem) => {
          const date = new Date(item.dateTo)
          item.date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        })

        this.dataSource.data = data
      })
    })
  }
}
