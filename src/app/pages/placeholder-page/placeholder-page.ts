import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
@Component({
  selector: 'app-placeholder-page',
  imports: [TitleCasePipe],
  templateUrl: './placeholder-page.html',
  styleUrl: './placeholder-page.css',
})
export class PlaceholderPage {
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly path = this.activatedRoute.snapshot.url[0]?.path ?? '';
}
