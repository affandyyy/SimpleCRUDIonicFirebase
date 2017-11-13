import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { NavController, AlertController, ActionSheetController } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Songs } from '../../model/song.model';
import { Observable } from 'rxjs/Observable';
import { AngularFireObject } from 'angularfire2/database/interfaces';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  songs: Observable<any[]>;
  Song: AngularFireList<Songs>;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    public afDb: AngularFireDatabase, public actionSheetCtrl: ActionSheetController) {
    this.songs = this.afDb.list('/songs').snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.val() as Songs;
        const id = a.payload.key;
        return {id, data};
      })
    })
    this.Song = this.afDb.list('/songs');
  }

  ngOnInit(){
    
  }

//   get (): AngularFireList<any[]>{
//     return this.afDb.list('/songs');
// }



  addSong(){
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Enter a name for this new song you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.Song.push({
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }

  showOptions(songId, songTitle) {
    console.log(songId, songTitle);
    
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Delete Song',
          role: 'destructive',
          handler: () => {
            this.removeSong(songId);
          }
        },{
          text: 'Update title',
          handler: () => {
            this.updateSong(songId, songTitle);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  removeSong(songId){
    this.Song.remove(songId);
  }

  updateSong(songId, songTitle){
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Update the name for this song",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value: songTitle
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.Song.update(songId, {
              title: data.title
            });
          }
        }
      ]
      
    });
    prompt.present();
  }

}
