import { inject, Pipe, PipeTransform } from "@angular/core";
import { TenancyResolverService } from "../services/tenancy-resolver.service";


@Pipe({ name: 'slugLink', standalone: true })
export class SlugLinkPipe implements PipeTransform {
  private tenancyService = inject(TenancyResolverService);

  transform(path: string | string[]) {
    const slug = this.tenancyService.slug();
    const segments = Array.isArray(path)
      ? path
      : path.split('/').filter(Boolean);
    return slug ? ['/', slug, ...segments] : ['/', ...segments];
  }
}