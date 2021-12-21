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

    deleteCountry(id: string) {
        const country = this.countries.find(x => x.id === id);
        if (!country) return;
        country.isDeleting = true;
        this.countryService.delete(id)
            .pipe(first())
            .subscribe(() => this.countries = this.countries.filter(x => x.id !== id));
    }
}