import * as moment from 'moment';
import { FORMAT_DATE, FORMAT_DATETIME, FORMAT_TIME } from '@shared/common/constants';
import { BadRequestException, ValidationError } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ValidationTypes } from 'class-validator';

export class FormatHelper {
  static formatDate(datetime?: Date): string {
    if (!datetime) return 'null';
    return moment(datetime).format(FORMAT_DATE);
  }

  static formatDatetime(datetime?: Date): string {
    if (!datetime) return 'null';
    return moment(datetime).format(FORMAT_DATETIME);
  }

  static formatTime(datetime?: Date): string {
    if (!datetime) return 'null';
    return moment(datetime).format(FORMAT_TIME);
  }

  static formatKeysToSnakeCase(obj: Record<string, any>): Record<string, any> {
    const snakeCaseObj: Record<string, any> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const snakeCaseKey = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
        snakeCaseObj[snakeCaseKey] = obj[key];
      }
    }
    return snakeCaseObj;
  }

  static formatValuesToSnakeCase(obj: Record<string, any>): Record<string, any> {
    const snakeCaseObj: Record<string, any> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        snakeCaseObj[key] =
          typeof obj[key] === 'string' ? obj[key].replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`) : obj[key];
      }
    }
    return snakeCaseObj;
  }

  static stringToBoolean(value: string): boolean {
    switch (value.toLowerCase().trim()) {
      case 'true':
      case 'yes':
      case '1':
        return true;
      case 'false':
      case 'no':
      case '0':
      case null:
      case undefined:
        return false;
      default:
        throw new BadRequestException(`Cannot convert string "${value}" to boolean.`);
    }
  }

  static exceptionFactory(errors: ValidationError[], i18nService: I18nService) {
    const formatError = (error: ValidationError) => {
      if (error.children?.length) {
        return {
          field: error.property,
          errors: error.children.map(formatError),
        };
      }

      if (Object.keys(error.constraints).includes(ValidationTypes.WHITELIST)) {
        const currentLanguage = I18nContext.current()?.lang || 'en';

        error.constraints[ValidationTypes.WHITELIST] = i18nService.t(`validation.${ValidationTypes.WHITELIST}`, {
          lang: currentLanguage,
          args: {
            property: error.property,
          },
        });
      }

      return {
        field: error.property,
        errors: Object.values(error.constraints),
      };
    };

    return errors.map((error) => formatError(error));
  }

  static formatException(statusCode: number, path: string, error: any) {
    return {
      statusCode,
      timestamp: new Date().getTime(),
      path,
      error,
    };
  }
}
