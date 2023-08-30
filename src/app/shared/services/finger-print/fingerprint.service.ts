import { Injectable } from '@angular/core';
import * as Fingerprint2 from 'fingerprintjs2';
import { from, Observable, shareReplay } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class FingerprintService {
  private readonly fingerprint$: Observable<string>;

  constructor() {
    this.fingerprint$ = this.generateFingerprint();
  }

  private generateFingerprint(): Observable<string> {
    return from(new Promise<string>((resolve) => {
      Fingerprint2.get((components) => {
        const fingerprint = Fingerprint2.x64hash128(components.map((component) => component.value).join(''), 31);
        resolve(fingerprint);
      });
    })).pipe(
      shareReplay(1) // Cache the emitted value for subsequent subscribers
    );
  }

  getFingerprint(): Observable<string> {
    return this.fingerprint$;
  }
}
