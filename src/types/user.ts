import { CustomFile } from 'src/components/upload';

// ----------------------------------------------------------------------

export type IUserTableFilterValue = string | string[];

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: string;
};

// ----------------------------------------------------------------------

export type IUserSocialLink = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: IUserSocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: Date;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: Date;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    message: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IUserItem = {
  id: string;
  name: string;
  city: string;
  role: string;
  email: string;
  state: string;
  status: string;
  address: string;
  country: string;
  zipCode: string;
  company: string;
  avatarUrl: string;
  phoneNumber: string;
  isVerified: boolean;
};

export type IUserAccount = {
  email: string;
  isPublic: boolean;
  displayName: string;
  city: string | null;
  state: string | null;
  about: string | null;
  country: string | null;
  address: string | null;
  zipCode: string | null;
  phoneNumber: string | null;
  photoURL: CustomFile | string | null;
};

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  createdAt: Date;
  invoiceNumber: string;
};

export type IUserAccountChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export interface IUpdateUserDto {
  full_name?: string;
  password?: string;
  is_active?: boolean;

  // Partner specific
  vehicle_plate?: string;
  id_card_front?: string | File | null;
  id_card_back?: string | File | null;
  driver_license_front?: string | File | null;
  driver_license_back?: string | File | null;

  // ServicePoint specific (Customer)
  address?: string;
  reward_amount?: number;
  advertising_budget?: number;
  geofence_radius?: number; // meters
  latitude?: number;
  longitude?: number;
}

// ----------------------------------------------------------------------

export interface IAdminServicePoint {
  id: string;
  name: string;
  address: string;
  location: string;
  geofence_radius: number;
  advertising_budget: number | string;
  reward_amount: number | string;
}

export interface IUserAdmin {
  id: string;
  username: string;
  full_name: string;
  role: 'ADMIN' | 'PARTNER' | 'CUSTOMER';
  tax_id: string | null;
  created_at: Date;
  partnerProfile?: {
    id: string;
    wallet_balance: number | string;
    bank_name?: string;
    bank_account?: string;
    vehicle_plate?: string;
    id_card_front?: string;
    id_card_back?: string;
    is_online?: boolean;
    current_location?: string;
    driver_license_front?: string;
    driver_license_back?: string;
  } | null;
  servicePoints?: IAdminServicePoint[];
}

export interface IUsersResponse {
  data: IUserAdmin[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
