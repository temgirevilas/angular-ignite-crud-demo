import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Countries } from '@app/_models';

const baseUrl = `${environment.apiUrl}/allCountries`;
const baseCountryUrl = `${environment.apiUrl}/country`;
// const baseUrl = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })

export class CountryService {
    constructor(private http: HttpClient) { }

    getAll(limit: number) {
        // return this.http.get<Countries[]>(baseUrl);
        return this.http.get<Countries[]>(baseUrl+`?limit=${limit}`);
    }

    getById(code2: string) {
        return this.http.get<Countries>(`${baseCountryUrl}/${code2}`);
    }

    create(params: any) {
        return this.http.post(baseCountryUrl, params);
    }

    update(id: string, params: any) {
        params.population = parseInt(params.population)
        return this.http.put(baseCountryUrl, params);
    }

    delete(code2: string) {
        return this.http.delete(`${baseCountryUrl}/${code2}`);
    }
}