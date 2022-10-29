import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Variable from "../expr/variable.ts";
import Statement from "../index.ts";

const PARSER = U.arg2R2(X.variable, X.variable);
export default class Swap extends Statement {
	public arg: Lazy<[Variable, Variable]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const [leftExpr, rightExpr] = this.arg.get();
		const left = leftExpr.getCell(vm);
		const leftIndex = await leftExpr.reduceIndex(vm);
		const right = rightExpr.getCell(vm);
		const rightIndex = await rightExpr.reduceIndex(vm);

		const leftValue = left.get(vm, leftIndex);
		const rightValue = right.get(vm, rightIndex);
		left.set(vm, rightValue, leftIndex);
		right.set(vm, leftValue, rightIndex);

		return null;
	}
}
