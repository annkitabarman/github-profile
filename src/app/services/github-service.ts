import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GithubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  blog: string;
  twitter_username: string | null;
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

  getUserDetails(username: string): Observable<GithubUser> {
    return this.http.get<GithubUser>(`${this.githubUrl}/users/${username}`);
  }
}
