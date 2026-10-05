import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ContributionCalendar } from '../models/github.contribution.model';
import { environment } from '../../environments/environment';
import { ContributionActivityResponse } from '../models/contribution-activity.model';

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

export interface Repository {
  id: string;
  name: string;
  nameWithOwner: string;
  description: string | null;
  url: string;
  isPrivate: boolean;
  isFork: boolean;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  parent: {
    nameWithOwner: string;
    url: string;
  } | null;
}

export interface PopularRepositoriesResponse {
  totalCount: number;
  nodes: Repository[];
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
    return this.http.get<ContributionCalendar>(
      `${this.backendUrl}/github/contributions/${username}/${year}`,
    );
  }

  getContributionActivity(username: string, year: number) {
    return this.http.get<ContributionActivityResponse>(
      `${this.backendUrl}/github/contribution-activity/${username}/${year}`,
    );
  }

  getPopularRepositories(username: string) {
    return this.http.get<PopularRepositoriesResponse>(
      `${this.backendUrl}/github/repositories/${username}`,
    );
  }
}
