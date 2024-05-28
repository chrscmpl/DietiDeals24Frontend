import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SearchSectionComponent } from '../search-section/search-section.component';
import { RouterLink } from '@angular/router';
import { RoutingUtilsService } from '../../services/routing-utils.service';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import {
    Observable,
    catchError,
    forkJoin,
    map,
    of,
    shareReplay,
    switchMap,
} from 'rxjs';
import { WindowService } from '../../services/window.service';
import { LogoComponent } from '../logo/logo.component';
import { NavigationService } from '../../services/navigation.service';
import { TranslateService } from '@ngx-translate/core';

const HIDDEN_QUERY_PARAMS = ['keywords'];

@Component({
    selector: 'dd24-header',
    standalone: true,
    imports: [
        SearchSectionComponent,
        RouterLink,
        TitleCasePipe,
        AsyncPipe,
        ButtonModule,
        BreadcrumbModule,
        TitleCasePipe,
        LogoComponent,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    constructor(
        public readonly authenticationService: AuthenticationService,
        public readonly routingUtils: RoutingUtilsService,
        public readonly windowService: WindowService,
        public readonly navigationService: NavigationService,
        private readonly translation: TranslateService,
    ) {}

    titleCasePipe: TitleCasePipe = new TitleCasePipe();

    public routes$: Observable<MenuItem[]> =
        this.routingUtils.currentLocation$.pipe(
            switchMap((location) => {
                const url: string[] = [];
                return forkJoin(this.PathToMenuItems(location.path, url)).pipe(
                    map((menuItems) => {
                        menuItems = menuItems.concat(
                            this.queryToMenuItems(location.query, url),
                        );
                        return menuItems;
                    }),
                );
            }),
            catchError((e) => {
                console.error(e);
                return of([]) as Observable<MenuItem[]>;
            }),
            shareReplay(1),
        );

    private PathToMenuItems(
        path: string[],
        url: string[],
    ): Observable<MenuItem>[] {
        return path.map((entry) => {
            url.push(entry);
            return this.translation.get(`ROUTES.${entry}`).pipe(
                map((translation) =>
                    translation !== entry
                        ? translation
                        : this.titleCasePipe.transform(
                              entry.replace(/-/g, ' '),
                          ),
                ),
                map((label) => {
                    return {
                        label,
                        routerLink: url,
                    };
                }),
            );
        });
    }

    private queryToMenuItems(
        query: { [key: string]: string },
        url: string[],
    ): MenuItem[] {
        return Object.entries(query)
            .filter(
                (queryParameter) =>
                    !HIDDEN_QUERY_PARAMS.includes(queryParameter[0]),
            )
            .map((queryParameter) => ({
                label: this.titleCasePipe.transform(queryParameter[1]),
                routerLink: url,
                queryParams: { [queryParameter[0]]: queryParameter[1] },
            }));
    }
}
