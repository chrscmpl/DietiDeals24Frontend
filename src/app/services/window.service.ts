import { Injectable } from '@angular/core';
import {
    distinctUntilChanged,
    fromEvent,
    map,
    shareReplay,
    startWith,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WindowService {
    constructor() {}

    public isMobile$ = fromEvent(window, 'resize').pipe(
        startWith(this.getIsMobile()),
        map(() => this.getIsMobile()),
        distinctUntilChanged(),
        shareReplay(1),
    );

    private getIsMobile() {
        return window.innerWidth <= 768;
    }
}
