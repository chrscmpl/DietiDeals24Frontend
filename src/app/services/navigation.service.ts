import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { link } from '../helpers/links';
import { TranslateService } from '@ngx-translate/core';
import { Observable, forkJoin, map, shareReplay, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private _routeBeforeRedirection: string | null = null;

    private readonly mainPages: link[] = [
        { name: 'HOME', url: 'home', icon: 'pi pi-home' },
        { name: 'YOUR_PAGE', url: 'your-page', icon: 'pi pi-user' },
        { name: 'CREATE_AUCTION', url: 'create-auction', icon: 'pi pi-plus' },
        { name: 'SECURITY&PRIVACY', url: 'your-page', icon: 'pi pi-lock' },
        { name: 'HELP', url: 'help', icon: 'pi pi-question' },
    ];

    public readonly mainPages$: Observable<link[]>;

    constructor(
        private router: Router,
        translation: TranslateService,
    ) {
        this.mainPages$ = translation.onLangChange.pipe(
            switchMap(() => {
                return forkJoin(
                    this.mainPages.map((page) => {
                        return translation.get(`NAV.PAGES.${page.name}`).pipe(
                            map((translatedName) => {
                                return { ...page, name: translatedName };
                            }),
                        );
                    }),
                );
            }),
            shareReplay(1),
        );
    }

    public get routeBeforeRedirection(): string | null {
        return this._routeBeforeRedirection;
    }

    public set routeBeforeRedirection(route: string | null) {
        this._routeBeforeRedirection = route;
    }

    public exitRoute() {
        const redirectRoute = this.routeBeforeRedirection || '/';
        this.routeBeforeRedirection = null;
        this.router.navigate([redirectRoute]);
    }

    public navigateRedirectingBack(route: string) {
        this.routeBeforeRedirection = this.router.url;
        this.router.navigate([route]);
    }
}
