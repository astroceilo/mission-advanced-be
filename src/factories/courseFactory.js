import { faker } from "@faker-js/faker";
import slugify from "slugify";

export const courseFactory = (overrides = {}) => {
  const title = faker.lorem.words(3);

  return {
    title,
    slug: slugify(title, { lower: true }),
    description: faker.lorem.paragraphs(2),
    thumbnail: faker.image.url({ category: "education" }),
    price: faker.number.int({ min: 100000, max: 2000000 }),
    discount_amount: faker.number.int({ min: 0, max: 500000 }),
    level: faker.helpers.arrayElement(["beginner", "intermediate", "advanced"]),
    is_published: faker.datatype.boolean(),
    total_modules: faker.number.int({ min: 5, max: 50 }),
    total_reviews: faker.number.int({ min: 0, max: 1000 }),
    rating_avg: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
    duration_total_seconds: faker.number.int({ min: 3600, max: 20000 }),
    instructor_id: null,
    ...overrides,
  };
};