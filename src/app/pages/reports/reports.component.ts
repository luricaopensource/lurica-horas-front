import { Component } from '@angular/core'
import { ReportsService } from 'src/app/shared/services/reports/reports.service'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {

  public pdfUrl: string = ''

  public constructor(private readonly reportService: ReportsService) {
    this.loadPdf()
  }

  async loadPdf(): Promise<void> {
    const blob = await this.reportService.getPdf()
    const url = URL.createObjectURL(blob)
    window.open(url)
  }
}
