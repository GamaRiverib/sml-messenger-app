import { PackageDimension } from "./package-dimension";
import { PackageWeight } from "./package-weight";

export class Package {
  size: string;
  description?: string;
  dimension?: PackageDimension;
  weight?: PackageWeight;
  content?: string;
}
