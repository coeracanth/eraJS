import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg2R2(X.expr, X.expr);
export default class SwapChara extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const [leftExpr, rightExpr] = this.arg.get();
		const left = await leftExpr.reduce(vm);
		assert.bigint(left, "1st argument of SWAPCHARA must be a number");
		const right = await rightExpr.reduce(vm);
		assert.bigint(right, "2nd argument of SWAPCHARA must be a number");

		const temp = vm.characterList[Number(left)];
		vm.characterList[Number(left)] = vm.characterList[Number(right)];
		vm.characterList[Number(right)] = temp;

		return null;
	}
}
