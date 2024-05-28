import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DropdownModule } from 'primeng/dropdown';
import { OneCharUpperPipe } from '../../pipes/one-char-upper.pipe';
import { CategorySelectionComponent } from './category-selection/category-selection.component';
import { Router } from '@angular/router';
import { Nullable } from '../../typeUtils/nullable';
import {
    AuctionSearchParameters,
    AuctionType,
} from '../../typeUtils/auction.utils';
import { CategoriesService } from '../../services/categories.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, forkJoin, map, shareReplay } from 'rxjs';
import { AsyncPipe, UpperCasePipe } from '@angular/common';

interface searchForm {
    keywords: FormControl<string | null>;
    type: FormControl<AuctionType | null>;
    category: FormControl<string | null>;
}

interface option {
    name: string;
    value: string | null;
}

@Component({
    selector: 'dd24-search-section',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        DropdownModule,
        OneCharUpperPipe,
        CategorySelectionComponent,
        TranslateModule,
        AsyncPipe,
    ],
    templateUrl: './search-section.component.html',
    styleUrl: './search-section.component.scss',
})
export class SearchSectionComponent implements OnInit {
    public searchForm!: FormGroup<searchForm>;

    public auctionTypeOptions$: Observable<option[]> = forkJoin(
        ['ALL', ...(Object.values(AuctionType) as string[])].map((type) => {
            return this.translate
                .get(
                    `NAV.SEARCH.AUCTION_TYPES.${this.upperCasePipe.transform(type)}`,
                )
                .pipe(
                    map((label) => ({
                        name: label,
                        value: type !== 'ALL' ? type : null,
                    })),
                );
        }),
    ).pipe(shareReplay(1));

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly categoriesService: CategoriesService,
        private readonly translate: TranslateService,
        private readonly upperCasePipe: UpperCasePipe,
    ) {}

    public ngOnInit(): void {
        this.searchForm = this.formBuilder.group<searchForm>({
            keywords: new FormControl<string | null>(null),
            type: new FormControl<AuctionType | null>(null),
            category: new FormControl<string | null>(null),
        });
    }

    public handleSubmit(): void {
        let params: Nullable<AuctionSearchParameters> = this.searchForm.value;
        if (
            params.category &&
            this.categoriesService.macroCategories?.includes(params.category)
        ) {
            const { category, ...rest } = params;
            params = {
                ...rest,
                macroCategory: category,
            };
        }
        this.router
            .navigateByUrl('/redirect', { skipLocationChange: true })
            .then(() => {
                this.router.navigate(['/auctions'], {
                    queryParams: params,
                });
            });
    }
}
