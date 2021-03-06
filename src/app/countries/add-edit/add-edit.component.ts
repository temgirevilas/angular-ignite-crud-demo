import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';

import { CountryService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })

export class AddEditComponent implements OnInit {
    form!: FormGroup;
    code2!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private countryService: CountryService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.code2 = this.route.snapshot.params['code'];
        this.isAddMode = !this.code2;
        
        this.form = this.formBuilder.group({
            code2: ['', Validators.required],
            code: ['', Validators.required],
            name: ['', Validators.required],
            region: ['', Validators.required],
            continent: ['', Validators.required],
            population: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.countryService.getById(this.code2)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop & return here if form is invalid
        if (this.isAddMode && this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createCountry();
        } else {
            this.updateCountry();
        }
    }

    private createCountry() {
        this.countryService.create(this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Country added', { keepAfterRouteChange: true });
                this.router.navigate(['../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }

    private updateCountry() {
        this.countryService.update(this.code2, this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Country updated', { keepAfterRouteChange: true });
                this.router.navigate(['../../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }
}