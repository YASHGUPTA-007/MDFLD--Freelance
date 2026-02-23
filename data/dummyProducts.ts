// data/dummyProducts.ts

export interface DummyProduct {
    id: string;
    title: string;
    brand: string;
    price: number;
    compareAtPrice?: number;
    condition: 'Brand New' | 'New with Tags' | 'Used - Like New' | 'Used - Good';
    image: string;
    category: string;
}

// Using picsum for placeholder images — consistent & fast
const BASE = 'https://picsum.photos/seed';

export const ALL_DUMMY_PRODUCTS: DummyProduct[] = [
    { id: '1', title: 'Nike Mercurial Superfly 9 Elite', brand: 'Nike', price: 279, compareAtPrice: 319, condition: 'Brand New', image: `${BASE}/boot1/600/750`, category: 'Boots' },
    { id: '2', title: 'Adidas Predator Accuracy Pro', brand: 'Adidas', price: 199, compareAtPrice: 249, condition: 'New with Tags', image: `${BASE}/boot2/600/750`, category: 'Boots' },
    { id: '3', title: 'PUMA King Platinum FG/AG', brand: 'PUMA', price: 149, condition: 'Used - Like New', image: `${BASE}/boot3/600/750`, category: 'Boots' },
    { id: '4', title: 'Under Armour Magnetico Pro 3', brand: 'UA', price: 129, condition: 'Brand New', image: `${BASE}/boot4/600/750`, category: 'Boots' },
    { id: '5', title: 'England Home Match Jersey 2024', brand: 'Nike', price: 119, compareAtPrice: 139, condition: 'Brand New', image: `${BASE}/jersey1/600/750`, category: 'Kits' },
    { id: '6', title: 'Real Madrid Away Kit 24/25', brand: 'Adidas', price: 109, condition: 'New with Tags', image: `${BASE}/jersey2/600/750`, category: 'Kits' },
    { id: '7', title: 'Man City Third Kit Player Ed.', brand: 'PUMA', price: 149, compareAtPrice: 169, condition: 'Brand New', image: `${BASE}/jersey3/600/750`, category: 'Kits' },
    { id: '8', title: 'Brazil Copa America Home 2024', brand: 'Nike', price: 95, condition: 'Used - Like New', image: `${BASE}/jersey4/600/750`, category: 'Kits' },
    { id: '9', title: 'adidas Tiro 23 Training Top', brand: 'Adidas', price: 55, compareAtPrice: 70, condition: 'Brand New', image: `${BASE}/training1/600/750`, category: 'Training' },
    { id: '10', title: 'Nike Dri-FIT Academy Pro GK Top', brand: 'Nike', price: 65, condition: 'Brand New', image: `${BASE}/training2/600/750`, category: 'Training' },
    { id: '11', title: 'PUMA teamFINAL Training Pant', brand: 'PUMA', price: 45, condition: 'New with Tags', image: `${BASE}/training3/600/750`, category: 'Training' },
    { id: '12', title: 'UA HOVR Phantom 3 Running', brand: 'UA', price: 139, compareAtPrice: 159, condition: 'Brand New', image: `${BASE}/training4/600/750`, category: 'Training' },
    { id: '13', title: 'Nike Tiempo Legend 10 Pro', brand: 'Nike', price: 175, compareAtPrice: 200, condition: 'Brand New', image: `${BASE}/boot5/600/750`, category: 'Boots' },
    { id: '14', title: 'Adidas Copa Pure 2 Elite', brand: 'Adidas', price: 259, condition: 'New with Tags', image: `${BASE}/boot6/600/750`, category: 'Boots' },
    { id: '15', title: 'Arsenal Home Kit 24/25', brand: 'Adidas', price: 99, compareAtPrice: 119, condition: 'Brand New', image: `${BASE}/jersey5/600/750`, category: 'Kits' },
    { id: '16', title: 'Bayern Munich Home Shirt 24/25', brand: 'Nike', price: 109, condition: 'Used - Like New', image: `${BASE}/jersey6/600/750`, category: 'Kits' },
    { id: '17', title: 'Grip Elite Goalkeeper Gloves', brand: 'Reusch', price: 79, compareAtPrice: 99, condition: 'Brand New', image: `${BASE}/glove1/600/750`, category: 'Accessories' },
    { id: '18', title: 'adidas Training Shin Guards', brand: 'Adidas', price: 25, condition: 'Brand New', image: `${BASE}/acc1/600/750`, category: 'Accessories' },
    { id: '19', title: 'Nike Match Ball Premier League', brand: 'Nike', price: 149, compareAtPrice: 165, condition: 'Brand New', image: `${BASE}/ball1/600/750`, category: 'Accessories' },
    { id: '20', title: 'Select Brillant Super FIFA Ball', brand: 'Select', price: 89, condition: 'Used - Like New', image: `${BASE}/ball2/600/750`, category: 'Accessories' },
    { id: '21', title: 'PUMA Future 7 Ultimate FG', brand: 'PUMA', price: 219, compareAtPrice: 249, condition: 'Brand New', image: `${BASE}/boot7/600/750`, category: 'Boots' },
    { id: '22', title: 'Mizuno Morelia Neo IV Beta', brand: 'Mizuno', price: 249, condition: 'New with Tags', image: `${BASE}/boot8/600/750`, category: 'Boots' },
    { id: '23', title: 'France Away Jersey Euro 2024', brand: 'Nike', price: 89, compareAtPrice: 109, condition: 'Used - Like New', image: `${BASE}/jersey7/600/750`, category: 'Kits' },
    { id: '24', title: 'Liverpool FC Training Jacket', brand: 'Nike', price: 75, condition: 'Brand New', image: `${BASE}/training5/600/750`, category: 'Training' },
    { id: '25', title: 'Nike Mercurial Vapor 15 Academy', brand: 'Nike', price: 69, compareAtPrice: 85, condition: 'Brand New', image: `${BASE}/boot9/600/750`, category: 'Boots' },
    { id: '26', title: 'adidas X Crazyfast.1 SG', brand: 'Adidas', price: 229, condition: 'Brand New', image: `${BASE}/boot10/600/750`, category: 'Boots' },
    { id: '27', title: 'Chelsea FC Home Shirt 24/25', brand: 'Nike', price: 99, compareAtPrice: 115, condition: 'Brand New', image: `${BASE}/jersey8/600/750`, category: 'Kits' },
    { id: '28', title: 'Goalkeeper Training Padded Short', brand: 'Reusch', price: 49, condition: 'Used - Like New', image: `${BASE}/gkshort/600/750`, category: 'Accessories' },
    { id: '29', title: 'Nike Air Zoom Mercurial Vapor 9', brand: 'Nike', price: 189, compareAtPrice: 209, condition: 'New with Tags', image: `${BASE}/boot11/600/750`, category: 'Boots' },
    { id: '30', title: 'Adidas Predator League FG', brand: 'Adidas', price: 89, condition: 'Brand New', image: `${BASE}/boot12/600/750`, category: 'Boots' },
    { id: '31', title: 'Germany Home Euro 2024 Kit', brand: 'Adidas', price: 99, compareAtPrice: 119, condition: 'Brand New', image: `${BASE}/jersey9/600/750`, category: 'Kits' },
    { id: '32', title: 'adidas Tiro 23 Competition Pant', brand: 'Adidas', price: 55, condition: 'New with Tags', image: `${BASE}/training6/600/750`, category: 'Training' },
    { id: '33', title: 'PUMA Attacanto TT Indoor Boot', brand: 'PUMA', price: 75, compareAtPrice: 90, condition: 'Brand New', image: `${BASE}/boot13/600/750`, category: 'Boots' },
    { id: '34', title: 'Nike Strike Pro Ball', brand: 'Nike', price: 35, condition: 'Used - Like New', image: `${BASE}/ball3/600/750`, category: 'Accessories' },
    { id: '35', title: 'PSG Home Jersey 24/25', brand: 'Nike', price: 109, compareAtPrice: 129, condition: 'Brand New', image: `${BASE}/jersey10/600/750`, category: 'Kits' },
    { id: '36', title: 'UA Blur Smoke 2 Turf', brand: 'UA', price: 79, condition: 'Brand New', image: `${BASE}/boot14/600/750`, category: 'Boots' },
];

export const CATEGORIES_LIST = ['All', 'Boots', 'Kits', 'Training', 'Accessories'];
export const PAGE_SIZE = 12;