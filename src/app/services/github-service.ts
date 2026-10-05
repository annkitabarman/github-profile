import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ContributionCalendar } from '../models/github.contribution.model';
import { environment } from '../../environments/environment';

export interface GithubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  followers: number;
  following: number;
  html_url: string;
  public_repos: number;
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly githubUrl = 'https://api.github.com';
  private readonly http = inject(HttpClient);
  private readonly backendUrl = environment.backendUrl;

  getUserDetails(username: string): Observable<GithubUser> {
    return this.http.get<GithubUser>(`${this.githubUrl}/users/${username}`).pipe(
      map((res) => ({
        login: res.login,
        name: res.name || null,
        avatar_url: res.avatar_url,
        bio: res.bio || null,
        company: res.company || null,
        location: res.location || null,
        email: res.email || null,
        followers: res.followers,
        following: res.following,
        html_url: res.html_url,
        public_repos: res.public_repos,
      })),
    );
  }

  getContributionsData(username: string, year: number): Observable<ContributionCalendar> {
    const params = new HttpParams().set('username', username).set('year', year);
    return this.http.get<ContributionCalendar>(`${this.backendUrl}/github/contributions`, {
      params,
    });
  }
}
