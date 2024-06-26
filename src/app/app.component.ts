import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingIndicator } from './helpers/loadingIndicator';
import { AsyncPipe } from '@angular/common';
import { WindowService } from './services/window.service';
import { MobileNavbarComponent } from './components/mobile-navbar/mobile-navbar.component';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { PrimeNGConfig } from 'primeng/api';
import { ThemeService } from './services/theme.service';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoadingPlaceholderComponent } from './components/loading-placeholder/loading-placeholder.component';
import { StretchOnScrollDirective } from './directives/stretch-on-scroll.directive';
import { SmartStickyDirective } from './directives/smart-sticky.directive';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'dd24-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        LoadingPlaceholderComponent,
        AsyncPipe,
        HeaderComponent,
        FooterComponent,
        MobileNavbarComponent,
        MobileHeaderComponent,
        ButtonModule,
        SidebarComponent,
        StretchOnScrollDirective,
        SmartStickyDirective,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public isLoadingRouteIndicator = new LoadingIndicator(100);

    constructor(
        public windowService: WindowService,
        private primengConfig: PrimeNGConfig,
        private themeService: ThemeService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.isLoadingRouteIndicator.start();
        this.configurePrimeNG();
        this.themeService.initTheme();
        this.initTranslations();
    }

    public onMainRouterOutletActivate(): void {
        this.isLoadingRouteIndicator.stop();
    }

    public onMainRouterOutletDeactivate(): void {
        this.isLoadingRouteIndicator.start();
    }

    private configurePrimeNG(): void {
        this.primengConfig.ripple = true;
    }

    private initTranslations(): void {
        this.translateService.addLangs(['en', 'it']);
        this.translateService.setDefaultLang('en');

        const systemLanguage = this.translateService.getBrowserLang();
        this.translateService.use(
            systemLanguage?.match(/en|it/) ? systemLanguage : 'en',
        );
    }
}
