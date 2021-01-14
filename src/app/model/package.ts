import { PackageDimension } from "./package-dimension";
import { PackageWeight } from "./package-weight";

export class Package {
  Size: string;
  Description?: string;
  Dimension?: PackageDimension;
  Weight?: PackageWeight;
  Content?: string;
}
