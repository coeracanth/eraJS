import type { Leaf } from "../../value/index.ts";
import type VM from "../../vm.ts";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export default interface Expr {
	reduce: (vm: VM) => Promise<Leaf>;
}
