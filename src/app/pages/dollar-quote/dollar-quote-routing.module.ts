import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DollarQuoteComponent } from './dollar-quote.component'

const routes: Routes = [
  { path: '', component: DollarQuoteComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DollarQuoteRoutingModule { }
