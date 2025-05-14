import { Component, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { Page } from './page.model';
import { MarkdownToHtmlPipe } from '../shared/markdown.pipe';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { BypassPipe } from '../shared/bypass.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  imports: [MarkdownToHtmlPipe, AsyncPipe, BypassPipe, FormsModule],
})
export default class PageComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apollo = inject(Apollo);

  slug = input.required<string>();
  isPreview = signal(true);

  readonly pageResource = rxResource({
    request: () => ({
      slug: this.slug(),
      isPreview: this.isPreview(),
    }),
    loader: ({ request }) => {
      return this.apollo
        .watchQuery<{ pages: Page[] }>({
          variables: {
            status: request.isPreview ? 'DRAFT' : 'PUBLISHED',
            filters: {
              slug: {
                eq: request.slug,
              },
            },
          },
          ...(isPlatformBrowser(this.platformId) &&
            request.isPreview && {
              pollInterval: 2000,
              fetchPolicy: 'network-only',
            }),
          query: gql`
            query Pages(
              $filters: PageFiltersInput
              $status: PublicationStatus
            ) {
              pages(filters: $filters, status: $status) {
                slug
                title
                body
              }
            }
          `,
        })
        .valueChanges.pipe(
          tap((x) => console.log('~~ ???', x)),
          map(
            ({
              data: {
                pages: [page],
              },
            }) => page,
          ),
          tap((x) => console.log('~~ page', x)),
        );
    },
  });
}
