import { Branch } from '../../domain/entities/branch.entity';
import { BranchReadModel } from '../../domain/read-models/branch.read-model';

export class BranchFactory {
  static toReadModel(branch: Branch): BranchReadModel {
    return {
      id: branch.id,
      code: branch.code,
      name: branch.name,
      location: branch.location,
      country: branch.country,
      state: branch.state,
      city: branch.city,
      isActive: branch.isActive,
    };
  }
}
