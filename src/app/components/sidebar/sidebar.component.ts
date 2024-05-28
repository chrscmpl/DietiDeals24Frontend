import { Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { WindowService } from '../../services/window.service';
import { AsyncPipe } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import {
    Observable,
    combineLatestWith,
    delay,
    map,
    of,
    startWith,
    switchMap,
} from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { MenuItem } from 'primeng/api';
import { NavigationService } from '../../services/navigation.service';
import { link } from '../../helpers/links';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'dd24-sidebar',
    standalone: true,
    imports: [SidebarModule, AsyncPipe, LogoComponent, PanelMenuModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
    constructor(
        public readonly windowService: WindowService,
        private readonly categoriesService: CategoriesService,
        private readonly navigationService: NavigationService,
        private readonly translation: TranslateService,
    ) {}

    public items$: Observable<MenuItem[]> = of([]);

    ngOnInit() {
        this.items$ = this.categoriesService.trendingCategories$.pipe(
            startWith([]),
            switchMap((categories) => {
                if (categories.length === 0)
                    return of(categories).pipe(delay(1000));
                return of(categories);
            }),
            combineLatestWith(
                this.pagesToMenuItems$(this.navigationService.mainPages$),
            ),
            map(([categories, mainPages]) => {
                const items: MenuItem[] = mainPages;
                if (categories.length === 0) return items;
                const categoriesItem: MenuItem = {
                    label: 'Trending Categories',
                    icon: 'pi pi-chart-line',
                    items: categories.map((category) => {
                        return {
                            label: category,
                            routerLink: ['/search', { category: category }],
                            command: () => this.hideSidebar(),
                        };
                    }),
                };
                items.splice(items.length - 2, 0, categoriesItem);
                return items;
            }),
        );
    }

    public hideSidebar(): void {
        this.windowService.isSidebarVisible = false;
    }

    private pagesToMenuItems$(
        pages: Observable<link[]>,
    ): Observable<MenuItem[]> {
        return pages.pipe(
            combineLatestWith(
                this.translation.get('NAV.PAGES.SETTINGS.HEADER'),
                this.translation.get('NAV.PAGES.SETTINGS.THEMES'),
            ),
            map(([pages, settingsLabel, themesLabel]) => {
                const items = pages.map((page) => {
                    return {
                        label: page.name,
                        routerLink: page.url,
                        icon: page.icon,
                        command: () => this.hideSidebar(),
                    } as MenuItem;
                });
                items.splice(pages.length - 1, 0, {
                    label: settingsLabel,
                    icon: 'pi pi-cog',
                    items: [
                        {
                            label: themesLabel,
                            icon: 'pi pi-palette',
                            routerLink: [
                                {
                                    outlets: {
                                        overlay: ['settings', 'theme'],
                                    },
                                },
                            ],
                            command: () => this.hideSidebar(),
                        },
                    ],
                });
                return items;
            }),
        );
    }
}
