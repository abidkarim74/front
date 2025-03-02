export interface UserProfileData {
  email: string;
  username: string;
  fullname: string;
  gender: string;
  profilePic: string;
  vehiclePic: string | null;
  type: string;
  isAdmin: boolean;
  phone: string | null;
  rating: number;
}
