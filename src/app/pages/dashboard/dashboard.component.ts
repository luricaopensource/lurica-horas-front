import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTable } from '@angular/material/table'
import { DashboardDataSource, DashboardItem } from './dashboard-datasource'
import { DashboardService } from 'src/app/shared/services/dashboard/dashboard.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
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

  constructor(private readonly dashboardService: DashboardService) {
    this.dataSource = new DashboardDataSource(this.dashboardService)
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    this.table.dataSource = this.dataSource
  }
}
