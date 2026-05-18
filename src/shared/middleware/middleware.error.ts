
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/shared/utils/utils.AppError';

export function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	// Log all errors (replace with a logger in production)
	if (process.env.NODE_ENV !== 'test') {
		// eslint-disable-next-line no-console
		console.error(`[${new Date().toISOString()}]`, err);
	}


	// If error is an instance of AppError, it's operational (expected)
	if (err instanceof AppError) {
		const response: Record<string, any> = {
			success: false,
			status: err.status,
			message: err.message,
		};
		if (process.env.NODE_ENV === 'development') {
			response.stack = err.stack;
		}
		return res.status(err.statusCode).json(response);
	}

	// Local type for Sequelize unique constraint error
	type SequelizeUniqueConstraintError = Error & { errors: { message: string }[] };

	if (
		err.name === 'SequelizeUniqueConstraintError' &&
		(err as SequelizeUniqueConstraintError).errors &&
		(err as SequelizeUniqueConstraintError).errors.length > 0
	) {
		const sqErr = err as SequelizeUniqueConstraintError;
		return res.status(409).json({
			success: false,
			status: 'fail',
			message: sqErr.errors[0].message || 'Unique constraint error',
		});
	}

	// Programming or unknown error: don't leak details in production
	const response: Record<string, any> = {
		success: false,
		status: 'error',
		message: process.env.NODE_ENV === 'development'
			? err.message || 'Internal Server Error'
			: 'Something went wrong!'
	};
	if (process.env.NODE_ENV === 'development') {
		response.stack = err.stack;
	}
	res.status(500).json(response);
}
