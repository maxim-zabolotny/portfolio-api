import { NotFoundException } from '@nestjs/common';

export const getTotalPages = (
  count: number,
  limit: number,
  page: number,
): number => {
  const totalPages = Math.ceil(count / limit);

  if (page > totalPages && count) {
    throw new NotFoundException();
  }
  return totalPages;
};
