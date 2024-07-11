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
  public isEditModal: boolean = false
  private companyToEdit: ICompany | null = null

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

    try {
      await this.companyService.createCompany(company)
      this.getCompanies()
      this.modalService.close()
      this.resetForm()
    }
    catch (error) {
      // TODO: Handle error properly
      console.error(error)
    }
  }

  public openEditCompanyModal(companyId: number, modalTemplate: TemplateRef<any>): void {
    this.resetForm()

    this.isEditModal = true

    this.companyToEdit = this.companies.find(company => company.id === companyId) ?? null

    if (!this.companyToEdit) return

    this.form.patchValue({ name: this.companyToEdit.name })

    this.openModal(modalTemplate, { size: 'lg', title: 'Editar empresa' })
  }

  public async editCompany(): Promise<void> {
    if (!this.companyToEdit) return

    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const { name } = this.form.value

    const company: ICompany = {
      id: this.companyToEdit.id,
      name
    }

    try {
      await this.companyService.updateCompany(company)
      this.getCompanies()
      this.modalService.close()
      this.resetForm()
    } catch (error) {
      // TODO: Handle error properly
      console.error(error)
    }
  }

  public async deleteCompany(companyId: number): Promise<void> {
    try {
      await this.companyService.deleteCompany(companyId)
      this.getCompanies()
    } catch (error) {
      // TODO: Handle error properly
      console.error(error)
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
