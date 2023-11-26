import { NgModule } from '@angular/core';
import { WheelClickDirective } from "./wheel-click.directive";

@NgModule({
  declarations: [WheelClickDirective],
  exports: [WheelClickDirective]
})
export class WheelClickModule {
}
