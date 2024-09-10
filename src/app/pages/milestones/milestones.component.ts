import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { IResponseModel } from 'src/app/shared/models'
import { IMilestoneCollapsible } from 'src/app/shared/models/milestones/milestones'
import { IProjectCollapsible } from 'src/app/shared/models/projects/projects'
import { MilestoneService } from 'src/app/shared/services/milestones/milestones.service'

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrls: ['../clients/clients.component.css']
})
export class MilestonesComponent implements OnInit {
  public form: FormGroup = new FormGroup({})
  @Input() project: IProjectCollapsible = {} as IProjectCollapsible

  constructor(
    private service: MilestoneService,
    private fb: FormBuilder,
  ) {

  }

  toggleEditMode(milestone: IMilestoneCollapsible): void {
    milestone.editMode = !milestone.editMode
  }

  ngOnInit(): void {
    this.buildForm()
  }

  private buildForm(): void {
    this.form = this.fb.group({
      name: '',
      date: '',
      amountPercentage: null
    })
  }

  stopPropagation(event: Event): void {
    event.stopPropagation()
  }

  addMilestone(): void {
    this.project.milestones.push({ name: '', date: '', amountPercentage: 0, created: false, editMode: true })
  }

  async saveMilestone(milestone: IMilestoneCollapsible, projectId: number, event: Event) {
    event.stopPropagation()
    const { name, date, amountPercentage } = this.form.value
    if (!name || !date || !amountPercentage) return

    this.toggleEditMode(milestone)

    try {
      const response: IResponseModel = await this.service.createMilestone({
        name,
        date,
        amountPercentage,
        projectId
      })

      milestone.id = response.id
      milestone.editMode = false
      milestone.created = true
    } catch (error) {
      // TODO: Handle error with toast notification
      console.error(error)
    }
  }

  async deleteMilestone(milestone: IMilestoneCollapsible, milestoneIndex: number, event: Event): Promise<void> {
    event.stopPropagation()

    if (!milestone.amountPercentage && !milestone.date && !milestone.name) {
      this.project.milestones.splice(milestoneIndex, 1)
      return
    }

    try {
      await this.service.deleteMilestone(milestone.id!)
      this.project.milestones.splice(milestoneIndex, 1)
    } catch (error) {
      // TODO: Handle error properly
      console.error(error)
    }
  }
}
