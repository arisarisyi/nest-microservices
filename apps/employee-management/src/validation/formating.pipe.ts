import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FormatingPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query' && value.nrp) {
      const nrp = value.nrp;
      if (typeof nrp === 'string') {
        value.nrp = [nrp];
      } else if (Array.isArray(nrp)) {
        value.nrp = nrp;
      } else {
        throw new BadRequestException('Invalid type for nrp');
      }
    }
    if (metadata.type === 'query' && value.site) {
      const site = value.site;
      if (typeof site === 'string') {
        value.site = [site];
      } else if (Array.isArray(site)) {
        value.site = site;
      } else {
        throw new BadRequestException('Invalid type for site');
      }
    }
    return value;
  }
}
