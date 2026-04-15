export interface BranchReadModel {
  id: number;
  code: string | null;
  name: string | null;
  location: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  isActive: boolean;
}
