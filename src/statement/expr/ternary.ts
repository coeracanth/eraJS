import * as assert from "../../assert.ts";
import type VM from "../../vm.ts";
import type Expr from "./index.ts";

export default class Ternary implements Expr {
	public condition: Expr;
	public left: Expr;
	public right: Expr;

	public constructor(condition: Expr, left: Expr, right: Expr) {
		this.condition = condition;
		this.left = left;
		this.right = right;
	}

	public async reduce(vm: VM) {
		const condition = await this.condition.reduce(vm);
		assert.bigint(
			condition,
			"Condition of ternary operator should be an integer",
		);
		return condition !== 0n ? this.left.reduce(vm) : this.right.reduce(vm);
	}
}
