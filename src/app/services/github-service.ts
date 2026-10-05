import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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
}
