import { fakerES as faker } from '@faker-js/faker';

export default class Mocks {

    products(quantity = 10) {
        const productsMock = [];

        for (let i = 0; i < quantity; i++) {
            const title = faker.commerce.productName();
            const description = faker.commerce.productDescription();
            const price = faker.commerce.price({ min: 1000, max: 200000, dec: 0 });
            const code = 'MOCK ' + faker.string.numeric(10);
            const status = faker.datatype.boolean();
            const stock = faker.number.int({ min: 5, max: 100 });
            const category = faker.commerce.department();
            const thumbnails = [faker.image.url(), faker.image.url()];
            
            productsMock.push({
                title,
                description,
                price,
                code,
                status,
                stock,
                category,
                thumbnails
            })
        }
        return productsMock;
    }

}