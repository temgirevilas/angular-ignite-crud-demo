import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { CountryService } from '@app/_services';
import { Countries } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    countries!: Countries[];

    constructor(private countryService: CountryService) {}

    ngOnInit() {
        this.countryService.getAll()
            .pipe(first())
            .subscribe(countries => this.countries = countries);
    }

    deleteCountry(code2: string) {
        const country = this.countries.find(x => x.code2 === code2);
        if (!country) return;
        country.isDeleting = true;
        this.countryService.delete(code2)
            .pipe(first())
            .subscribe(() => this.countries = this.countries.filter(x => x.code2 !== code2));
    }
}