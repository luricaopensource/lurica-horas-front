import { Component, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ICompany } from 'src/app/shared/models/companies/companies'
import { CompanyService } from 'src/app/shared/services/company/company.service'

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  public form: FormGroup = new FormGroup({})
  public companies: ICompany[] = []
  public formSubmitted: boolean = false

  constructor(private companyService: CompanyService) {
  }

  ngOnInit(): void {
    this.getCompanies()
  }

  private async getCompanies(): Promise<void> {
    const companies = await this.companyService.getCompanies()

    this.companies = companies
  }

  async saveCompanyDataInLocalStorage(company: ICompany): Promise<void> {
    localStorage.setItem('company', JSON.stringify(company))
  }

}
