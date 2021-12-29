import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CountriesRoutingModule } from './countries-routing.module';

import { LayoutComponent } from './layout/layout.component';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CountriesRoutingModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        FlexLayoutModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent
    ],
    exports: [
        MatFormFieldModule,
        MatInputModule,
    ]
})
export class CountriesModule { }