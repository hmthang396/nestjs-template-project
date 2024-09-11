import { Module } from '@nestjs/common';
import { I18nModule, AcceptLanguageResolver, QueryResolver, HeaderResolver, CookieResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../../i18n/'),
        watch: true,
        includeSubfolders: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.join(__dirname, '../../../../src/infrastructures/config/i18n/i18n.generated.ts'),
      // throwOnMissingKey:true
    }),
  ],
  exports: [I18nModule],
})
export class I18nConfigModule {}
