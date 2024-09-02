import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DollarQuoteService } from 'src/app/shared/services/dollar-quote/dollar-quote.service'

@Component({
  selector: 'app-dollar-quote',
  templateUrl: './dollar-quote.component.html',
  styleUrls: ['./dollar-quote.component.css']
})
export class DollarQuoteComponent implements OnInit {
  public form: FormGroup = new FormGroup({})

  constructor(private fb: FormBuilder, private service: DollarQuoteService) {
  }

  ngOnInit(): void {
    this.buildForm()
    this.getDollarQuote()
  }

  async getDollarQuote(): Promise<void> {
    const { official, blue } = await this.service.getDollarQuote()
    this.form.patchValue({
      officialDollar: parseFloat(String(official)),
      blueDollar: parseFloat(String(blue))
    })
  }

  buildForm() {
    this.form = this.fb.group({
      officialDollar: [null, [Validators.required]],
      blueDollar: [null, [Validators.required]],
    })
  }

  saveData(): void {
    const { officialDollar, blueDollar } = this.form.value

    try {
      this.service.saveDollarQuote({ id: 1, official: officialDollar, blue: blueDollar })
      this.form.markAsPristine()
    }
    catch (error) {
      console.error(error)
    }
  }
}
