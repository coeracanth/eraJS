import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type { Leaf } from "../../value/index.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.argNR0(X.expr);
export default class Return extends Statement {
	public arg: Lazy<Expr[]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const result: Array<Leaf> = [];
		for (const expr of this.arg.get()) {
			result.push(await expr.reduce(vm));
		}

		return {
			type: "return",
			value: result,
		} as const;
	}
}
