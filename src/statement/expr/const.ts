import type { Leaf } from "../../value/index.ts";
import type VM from "../../vm.ts";
import type Expr from "./index.ts";

export default class Const implements Expr {
	public value: Leaf;

	public constructor(value: Const["value"]) {
		this.value = value;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async reduce(_vm: VM): Promise<Leaf> {
		return this.value;
	}
}
