import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ICompany } from 'src/app/shared/models/companies/companies'
import { ModalService } from 'src/app/shared/services/modal/modal.service'
import { CompanyService } from 'src/app/shared/services/companies/company.service'

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent {
  public companies: ICompany[] = []
  public form: FormGroup = new FormGroup({})
  public formSubmitted: boolean = false

  constructor(
    private companyService: CompanyService,
    private formBuilder: FormBuilder,
    private modalService: ModalService) {
    this.buildForm()
    this.getCompanies()
  }

  private async getCompanies(): Promise<void> {
    const companies = await this.companyService.getCompanies()

    this.companies = companies
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
    })
  }

  private openModal(modalTemplate: TemplateRef<any>, options: { size: string, title: string }) {
    this.modalService
      .open(modalTemplate, options)
      .subscribe()
  }

  public openNewCompanyModal(modalTemplate: TemplateRef<any>): void {
    this.openModal(modalTemplate, { size: 'lg', title: 'Crear empresa' })
    this.resetForm()
  }

  public async createCompany(): Promise<void> {
    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const company: ICompany = this.form.value

    const response = await this.companyService.createCompany(company)
    if (response.id) {
      this.getCompanies()
      this.modalService.close()
      this.resetForm()
    }
  }

  public isInvalidInput(inputName: string): boolean {
    const input = this.form.get(inputName)

    if (!input) return false

    return input.invalid && (input.dirty || input.touched || this.formSubmitted)
  }

  private resetForm(): void {
    this.form.reset()
    this.formSubmitted = false
  }
}
