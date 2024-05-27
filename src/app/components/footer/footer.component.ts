import { Component, OnDestroy, OnInit } from '@angular/core';
import { link } from '../../helpers/links';
import { RouterLink } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'dd24-footer',
    standalone: true,
    imports: [RouterLink, TranslateModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];
    public links: link[] = [];

    constructor(private readonly navigationService: NavigationService) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.navigationService.mainPages$.subscribe((pages) => {
                this.links = pages;
            }),
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) =>
            subscription.unsubscribe(),
        );
    }
}
