import * as assert from "../../assert.ts";
import type VM from "../../vm.ts";
import type Expr from "./index.ts";
import type Variable from "./variable.ts";

type Operator = "++" | "--";

export default class UnaryOp implements Expr {
	public target: Variable;
	public op: Operator;
	public postfix: boolean;

	public constructor(target: Variable, op: Operator, postfix: boolean) {
		this.target = target;
		this.op = op;
		this.postfix = postfix;
	}

	public async reduce(vm: VM): Promise<bigint> {
		const cell = this.target.getCell(vm);
		const index = await this.target.reduceIndex(vm);
		const value = cell.get(vm, index);
		assert.bigint(value, `Operand of ${this.op} should be an integer`);
		switch (this.op) {
			case "++":
				cell.set(vm, value + 1n, index);
				break;
			case "--":
				cell.set(vm, value - 1n, index);
				break;
		}

		if (this.postfix) {
			return value;
		} else {
			switch (this.op) {
				case "++":
					return value + 1n;
				case "--":
					return value - 1n;
			}
		}
	}
}
