import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Music } from '../models/Music';
import { Observable } from 'rxjs';
import { Favorite } from '../models/Favorite';

@Injectable({
    providedIn: 'root'
})
export class MusicService {
    public favoritesUrl="http://localhost:51134/api/";

    public constructor(private httpClient: HttpClient) { }

    public getMusic(): Observable<Music> {//Get Top 200 shazam
        let bearerValue = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF2aXZAY3ljdXJpdHkuY29tIiwibmFtZSI6ImF2aXYiLCJpYXQiOjE1NTQ4ODIyOTl9._cLVE40a47NXHENdLCd8L4AGaORzJs8vkIMFIt4WyWU";
        const httpOptions = {
            headers: new HttpHeaders({//Set Headers
                'Content-Type': 'application/json',
                'Authorization': bearerValue
            })
        };
        return this.httpClient.get<Music>("https://fullstack-test-server.herokuapp.com/api/songs", httpOptions);
    }

    public getAllFavorites(): Observable<Favorite[]> {//Get favorites from server
        return this.httpClient.get<Favorite[]>(this.favoritesUrl+"getAllFavorites");
    }

    public addFavorite( favorite:Favorite):Observable<Favorite>{//Add favorite to DB
        return this.httpClient.post<Favorite>(this.favoritesUrl + "addToFavorites", favorite);
    }

    public deleteFavorite(id:number):Observable<any> {//Delete favorite from DB
        return this.httpClient.delete(this.favoritesUrl + "deleteFavorite/" + id);
    }
}
