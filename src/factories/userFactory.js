import { faker } from "@faker-js/faker";

export const userFactory = (overrides = {}) => {
    return {
        full_name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        email_verified_at: faker.date.past(),
        gender: faker.helpers.arrayElement(["male", "female"]),
        phone: faker.phone.number(),
        password: overrides.password,
        role: overrides.role || "student",
        status: "active",
        ...overrides,
    }
};