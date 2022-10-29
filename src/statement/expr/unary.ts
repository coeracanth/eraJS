import * as assert from "../../assert.ts";
import type VM from "../../vm.ts";
import type Expr from "./index.ts";

type Operator = "+" | "-" | "!" | "~";

export default class Unary implements Expr {
	public expr: Expr;
	public op: Operator;

	public constructor(op: Operator, expr: Expr) {
		this.op = op;
		this.expr = expr;
	}

	public async reduce(vm: VM): Promise<bigint> {
		const value = await this.expr.reduce(vm);
		assert.bigint(value, `Operand of ${this.op} should be an integer`);

		switch (this.op) {
			case "+":
				return value;
			case "-":
				return -value;
			case "!":
				return value === 0n ? 1n : 0n;
				// eslint-disable-next-line no-bitwise
			case "~":
				return ~value;
		}
	}
}
