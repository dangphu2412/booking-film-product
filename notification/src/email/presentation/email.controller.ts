import { Controller } from '@nestjs/common';
import {
  MailBody,
  MailServiceControllerMethods,
} from '@dnp2412/shipping-protos/dist/proto/notification/mail/v1/mail';

@MailServiceControllerMethods()
@Controller()
export class EmailController {
  send(request: MailBody): void {
    console.log(request);
  }
}
