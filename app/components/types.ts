export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  isFavorite: boolean;
  size?: string;
  country: string;
  pickupPoint: string;
}

export interface Friend {
  id: number;
  avatar: string;
  name: string;
}

export type ProductCardVariant = 'normal' | 'compact';
