import { Component, OnInit ,ViewChildren, QueryList, ElementRef,EventEmitter ,Output,Input, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { CountryService } from '@app/_services';
import { Countries } from '@app/_models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    countries!: Countries[];
    displayedColumnsView: string[] = ['code','name','continent','region','population','code2','action'];
    dataSourceView = new MatTableDataSource<any>();
    totalRecords:any;
    constructor(private countryService: CountryService) {}
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    ngOnInit() {
        this.countryService.getAll().pipe(first()).subscribe(countries =>{ 
            this.countries = countries;
            this.dataSourceView = new MatTableDataSource(this.countries);
            this.totalRecords = this.countries.length;
        });
    }

    ngAfterViewInit(): void {
        this.dataSourceView.sort = this.sort;
        this.dataSourceView.paginator = this.paginator;
    }

    deleteCountry(code2: string) {
        const country = this.countries.find(x => x.code2 === code2);
        if (!country) return;
        country.isDeleting = true;
        this.countryService.delete(code2)
            .pipe(first())
            .subscribe(() => this.countries = this.countries.filter(x => x.code2 !== code2));
    }

    doFilter(value:any) {
        this.dataSourceView.filter = value.trim().toLocaleLowerCase();
    }
}