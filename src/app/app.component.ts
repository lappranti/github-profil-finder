import { Component } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'github-profil-finder';

  baseUrl: string = 'https://api.github.com/users/';
  username: string = 'lappranti';
  profile: any = null;
  findedProfile: any = null;
  showFindedProfile: boolean = true;

  repos!: any;
  displRepos!: any;

  infos: any[] = [];

  constructor() {
    this.getProfile();
    this.getRepos();
  }

  getProfile() {
    this.fetchProfile(this.username).then((data) => {
      if (data.id) {
        this.profile = data;
        this.initiliseInfo(data);
      }
    });
  }

  getRepos() {
    this.fetchRepos(this.username).then((data) => {
      if (data) {
        this.repos = data;
        this.displRepos = data.slice(0, 6);
      }
    });
  }

  formatDate(date: Date) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  initiliseInfo(profile: any) {
    this.infos = [];
    this.infos.push({ label: 'Followers', value: profile.followers });
    this.infos.push({ label: 'Following', value: profile.following });
    this.infos.push({
      label: 'Location',
      value: profile.location,
    });
    this.infos.push({
      label: 'Public repos',
      value: profile.public_repos,
    });
  }

  async fetchProfile(username: string) {
    try {
      const response = await fetch(this.baseUrl + username);
      const data = await response.json();

      console.log(data);

      return data;
    } catch (error) {
      return null;
    }
  }

  async fetchRepos(username: string) {
    try {
      const response = await fetch(`${this.baseUrl}${username}/repos`);
      const data = await response.json();

      console.log(data);

      return data;
    } catch (error) {
      return null;
    }
  }

  handleViewAllRepos() {
    this.displRepos = this.repos;
  }

  handleShowLessRepos() {
    this.displRepos = this.repos.slice(0, 6);
  }

  search() {
    if (this.username.length != 0) {
      this.fetchProfile(this.username).then((data) => {
        if (data.id) {
          this.toggleProfileContainer();
          this.findedProfile = data;
        }
      });
    } else {
      this.findedProfile = null;
    }
  }

  selectProfile() {
    this.profile = this.findedProfile;
    this.getProfile();
    this.getRepos();
    this.toggleProfileContainer();
  }

  toggleProfileContainer() {
    this.showFindedProfile = !this.showFindedProfile;
  }
}
