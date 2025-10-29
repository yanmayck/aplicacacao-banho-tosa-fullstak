import { SetMetadata } from '@nestjs/common';

export const PublicFeature = (feature: string) =>
  SetMetadata('publicFeature', feature);
