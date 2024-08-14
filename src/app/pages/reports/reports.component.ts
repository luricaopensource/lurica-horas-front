import { Component } from "@angular/core"
import { FormBuilder, FormGroup } from "@angular/forms"
import { IClient } from "src/app/shared/models/clients/clients"
import { IMilestone } from "src/app/shared/models/milestones/milestones"
import { IProject } from "src/app/shared/models/projects/projects"
import { IUser } from "src/app/shared/models/users/user"
import { ClientService } from "src/app/shared/services/clients/client.service"
import { MilestoneService } from "src/app/shared/services/milestones/milestones.service"
import { ProjectService } from "src/app/shared/services/project/project.service"
import { ReportsService } from "src/app/shared/services/reports/reports.service"
import { UserService } from "src/app/shared/services/user/user.service"

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.css"]
})
export class ReportsComponent {
  public pdfUrl: string = ""
  public reportForm: FormGroup = new FormGroup({})
  public employees: IUser[] = []
  public projects: IProject[] = []
  public customers: IClient[] = []
  public milestones: IMilestone[] = []

  public constructor(
    private readonly reportService: ReportsService,
    private fb: FormBuilder,
    private userService: UserService,
    private projectService: ProjectService,
    private milestoneService: MilestoneService,
    private clientService: ClientService
  ) {
    this.buildForm()
    this.getEntities()
  }

  private async getEntities(): Promise<void> {
    this.employees = await this.userService.getEmployees()
    this.projects = await this.projectService.getProjects()
    this.customers = await this.clientService.getClients()
    this.milestones = await this.milestoneService.getMilestones()
  }

  async generateReport(): Promise<void> {
    const dateFrom = this.reportForm.value.dateFrom
    const dateTo = this.reportForm.value.dateTo

    const dateFromString = dateFrom ? dateFrom.toISOString() : null
    const dateToString = dateTo ? dateTo.toISOString() : null

    const body = {
      employeeId: this.reportForm.value.employeeId,
      projectId: this.reportForm.value.projectId,
      customerId: this.reportForm.value.customerId,
      milestoneId: this.reportForm.value.milestoneId,
      dateFrom: this.reportForm.value.dateFrom,
      dateTo: this.reportForm.value.dateTo
    }

    console.log(body)

    // const blob = await this.reportService.getPdf(body)
    // const url = URL.createObjectURL(blob)
    // window.open(url)
  }

  buildForm() {
    this.reportForm = this.fb.group({
      employeeId: [null],
      projectId: [null],
      customerId: [null],
      milestoneId: [null],
      dateFrom: [null],
      dateTo: [null]
    })
  }
}
