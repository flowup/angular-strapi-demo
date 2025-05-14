import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { Page } from '../page/page.model';
import { Apollo, gql } from 'apollo-angular';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="container">
      <hgroup>
        <h1>Angular + Strapi + GraphQL</h1>
        <p>
          A pre-render Angular SSG demo working in live content preview with
          Strapi and GraphQL.
        </p>
        <nav>
          <ul>
            <li>
              <details class="dropdown">
                <summary role="button" class="secondary">
                  Select page to render
                </summary>
                <ul>
                  @for (page of allPagesResource.value(); track page.slug) {
                    <li>
                      <a [routerLink]="['page', page.slug]">{{ page.title }}</a>
                    </li>
                  }
                </ul>
              </details>
            </li>
          </ul>
        </nav>
      </hgroup>
    </header>

    <main class="container"><router-outlet /></main>
  `,
})
export class AppComponent {
  private readonly apollo = inject(Apollo);
  readonly allPagesResource = rxResource({
    loader: () => {
      return this.apollo
        .watchQuery<{ pages: Page[] }>({
          variables: {
            status: 'PUBLISHED',
          },
          query: gql`
            query Pages($status: PublicationStatus) {
              pages(status: $status) {
                title
                slug
              }
            }
          `,
        })
        .valueChanges.pipe(
          map(({ data: { pages } }) => pages),
          tap((x) => console.log('~~ pages', x)),
        );
    },
  });
}
