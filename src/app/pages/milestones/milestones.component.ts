import { Component, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { IResponseModel } from 'src/app/shared/models'
import { IMilestoneCollapsible } from 'src/app/shared/models/milestones/milestones'
import { IProjectCollapsible } from 'src/app/shared/models/projects/projects'
import { MilestoneService } from 'src/app/shared/services/milestones/milestones.service'

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrls: ['../clients/clients.component.css']
})
export class MilestonesComponent {
  public form: FormGroup = new FormGroup({})
  @Input() project: IProjectCollapsible = {} as IProjectCollapsible

  constructor(
    private service: MilestoneService
  ) {

  }

  stopPropagation(event: Event): void {
    event.stopPropagation()
  }

  addMilestone(): void {
    this.project.milestones.push({ name: '', date: '', amountPercentage: 0, created: false, editMode: true })
  }

  async saveMilestone(milestone: IMilestoneCollapsible, projectId: number, event: Event) {
    event.stopPropagation()

    if (!milestone.editMode) {
      milestone.editMode = true
      return
    }

    if (!milestone.name || !milestone.date || !milestone.amountPercentage) return

    const response: IResponseModel = await this.service.createMilestone({
      name: milestone.name,
      date: milestone.date,
      amountPercentage: milestone.amountPercentage,
      projectId
    })

    milestone.id = response.id
    milestone.editMode = false
    milestone.created = true
  }

  async deleteMilestone(milestone: IMilestoneCollapsible, event: Event): Promise<void> {
    event.stopPropagation()

    if (!milestone.amountPercentage && !milestone.date && !milestone.name) {
      // this.deleteEntity(i, j, k, event)
      return
    }

    try {
      await this.service.deleteMilestone(milestone.id!)
      // this.getClients()
    } catch (error) {
      // TODO: Handle error properly
      console.error(error)
    }
  }

  public isInvalidInput(input: string): boolean {
    // TODO: Validate input
    return false
  }
}
