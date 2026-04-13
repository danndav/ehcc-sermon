import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Webhooks')
@Controller('webhooks/paystack')
export class WebhookController {
  // Public endpoint — Paystack signature verification used instead of JWT
  constructor() {}
}
