import { Component, OnInit } from '@angular/core';
import { MusicService } from 'src/app/services/music.service';
import { Chart } from 'src/app/models/Chart';
import { Favorite } from 'src/app/models/Favorite';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public songs= new Array<Chart>();
    public favorites = new Array<Favorite>();
    public buttonImages = new Array<String>();
    public searchText = "";

    public constructor(private musicService: MusicService) { }

    public ngOnInit() {
        this.getAllSongs();
        this.initButtons();
        this.getAllFavorites();
    }
    
    public initButtons(): void {
        for (let i = 0; i < 200; i++) {
            this.buttonImages[i] = "add-favorite";//Init buttons with empty heart;
        }
    }

    public getAllSongs(): void {//Get top 200 shazam
        let observable = this.musicService.getMusic();
        observable.subscribe(m => { 
            for(let i=0; i<200; i++){
                this.songs.push(m.chart[i]);
            }
        });
    }

    public addOrRemoveFromFavorites(index: number) {//If song exist in favorits- remove, else add.
        this.musicService.getAllFavorites().subscribe(f => {
            this.favorites = f;
            this.favorites.some(
                f => f.indexInClientArray == index) ? this.removeFromFavorites(index) : this.addToFavorites(index);
        });
    }

    public addToFavorites(index: number) {//Add song to favorites
        this.addFavoriteCss(index);
        let temp = this.songs[index];
        let favorite = new Favorite(index, temp.heading.title, temp.heading.subtitle, temp.share.image, temp.share.href);
        this.musicService.addFavorite(favorite).subscribe();
    }

    public removeFromFavorites(index: number) {//Remove song from favorites
        this.removeFavoriteCss(index);
        this.buttonImages[index] = "add-favorite";
        this.musicService.deleteFavorite(index).subscribe();
    }

    public getAllFavorites(): void {//Get all favorites from server
        this.musicService.getAllFavorites().subscribe(f => {
            this.favorites = f;
            for (let i = 0; i < this.favorites.length; i++) {
                this.addFavoriteCss(this.favorites[i].indexInClientArray);
            }
        });
    }

    public addFavoriteCss(index) {//Add favorites style 
        this.buttonImages[index] = "remove-favorite";
        if(document.getElementsByTagName("tr")[index])
        document.getElementsByTagName("tr")[index].classList.add("favorite");
    }

    public removeFavoriteCss(index){//Remove favorites style
        this.buttonImages[index] = "add-favorite";
        document.getElementsByTagName('tr')[index].classList.remove("favorite");
    }
}
