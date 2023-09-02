import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from "@angular/animations";

export const slideLeftRight: AnimationTriggerMetadata =
  trigger('slideLeftRight', [
    state('in', style({transform: 'translateX(0)'})),
    transition(':enter', [
      style({transform: 'translateX(-100%)'}),
      animate('0.3s ease-in')
    ]),
    transition(':leave', [
      animate('0.5s ease-out', style({ transform: 'translateX(-100%)' }))
    ])
  ])

