import { Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class GenericExceptionsFilter implements ExceptionFilter {
	catch(exception: any) {
		console.log(exception);
	}
}
