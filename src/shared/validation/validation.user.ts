import { UserCreationAttributes } from '@/shared/types/types.user';
import { User } from '@/shared/models/models.user';

// Async custom validation for user creation including unique email check
export const validateCreateUserRequest = async (
  payload: UserCreationAttributes
): Promise<string[]> => {
  const errors: string[] = [];

  const requiredFields: (keyof UserCreationAttributes)[] = [
    'email',
    'password',
    'roleId',
  ];

  requiredFields.forEach(field => {
    if (
      payload[field] === undefined ||
      payload[field] === null ||
      (typeof payload[field] === 'string' && payload[field].trim() === '')
    ) {
      if (field === 'roleId') {
        errors.push('Role ID is required');
      } else {
        errors.push(`${field} is required`);
      }
    }
  });

  if (payload.email && !/^\S+@\S+\.\S+$/.test(payload.email)) {
    errors.push('Email must be a valid email address');
  }

  if (payload.password && typeof payload.password === 'string' && payload.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (
    payload.roleId !== undefined &&
    (typeof payload.roleId !== 'number' || isNaN(payload.roleId))
  ) {
    errors.push('Role ID must be a valid number');
  }

  // Unique email check (async)
  if (payload.email) {
    const user = await User.findOne({ where: { email: payload.email } });
    if (user) {
      errors.push('Email already exists');
    }
  }

  return errors;
};

// Custom validation for user update
export const validateUpdateUserRequest = (
  payload: Partial<UserCreationAttributes>
): string[] => {
  const errors: string[] = [];

  if (payload.email && !/^\S+@\S+\.\S+$/.test(payload.email)) {
    errors.push('Email must be a valid email address');
  }

  if (payload.password && typeof payload.password === 'string' && payload.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (
    payload.roleId !== undefined &&
    (typeof payload.roleId !== 'number' || isNaN(payload.roleId))
  ) {
    errors.push('Role ID must be a valid number');
  }

  return errors;
};
