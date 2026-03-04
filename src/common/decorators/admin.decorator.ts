import { SetMetadata } from '@nestjs/common';
import { CONSTS } from '../consts';


export const IS_ADMIN_KEY = 'isAdmin';

export const AdminOnly = () => SetMetadata(
    IS_ADMIN_KEY, true
);