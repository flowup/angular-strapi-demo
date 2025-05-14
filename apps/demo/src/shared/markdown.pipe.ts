import { Pipe, PipeTransform } from '@angular/core';
import { from, Observable, of } from 'rxjs';

@Pipe({
  name: 'markdownToHtml',
  standalone: true,
})
export class MarkdownToHtmlPipe implements PipeTransform {
  transform(markdown: string): Observable<string> {
    return markdown
      ? from(
          import('marked').then(({ marked }) =>
            marked(markdown, { async: true }),
          ),
        )
      : of('');
  }
}
