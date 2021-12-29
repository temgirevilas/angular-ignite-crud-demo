import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

import { Role } from '@app/_models';

// array in local storage for registered users
const countiesKey = 'angular-ignite-country-demo';
const countriesJSON = localStorage.getItem(countiesKey);
let countries: any[] = countriesJSON ? JSON.parse(countriesJSON) : [{
    id: 1,
    code: 'IND',
    name: 'India',
    region: 'Asia',
    continent: 'Asia',
    population: '123456',
    code2: 'IN'
}];


@Injectable()

export class DemoBackendCountryInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/countries') && method === 'GET':
                    return getCountries();
                case url.match(/\/countries\/\d+$/) && method === 'GET':
                    return getCountryById();
                case url.endsWith('/countries') && method === 'POST':
                    return createCountry();
                case url.match(/\/countries\/\d+$/) && method === 'PUT':
                    return updateCountry();
                case url.match(/\/countries\/\d+$/) && method === 'DELETE':
                    return deleteCountry();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions
        function getCountries() {
            return ok(countries.map(x => basicDetails(x)));
        }

        function getCountryById() {
            const Country = countries.find(x => x.code2 === idFromUrl());
            return ok(basicDetails(Country));
        }

        function createCountry() {
            const Country = body;

            // assign Country id and a few other properties then save
            // Country.id = newCountryId();
            countries.push(Country);
            localStorage.setItem(countiesKey, JSON.stringify(countries));

            return ok();
        }

        function updateCountry() {
            let params = body;
            let Country = countries.find(x => x.id === idFromUrl());

            // update and save Country
            Object.assign(Country, params);
            localStorage.setItem(countiesKey, JSON.stringify(countries));

            return ok();
        }

        function deleteCountry() {
            countries = countries.filter(x => x.id !== idFromUrl());
            localStorage.setItem(countiesKey, JSON.stringify(countries));
            return ok();
        }

        // helper functions

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message: any) {
            return throwError({ error: { message } })
                .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
        }

        function basicDetails(Country: any) {
            const { code2, code, name, region, continent, population } = Country;
            return { code2, code, name, region, continent, population };
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function newCountryId() {
            return countries.length ? Math.max(...countries.map(x => x.id)) + 1 : 1;
        }
    }
}

export const fakeBackendCountryProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: DemoBackendCountryInterceptor,
    multi: true
};