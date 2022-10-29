import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(X.expr);
export default class Redraw extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const value = await this.arg.get().reduce(vm);
		assert.bigint(value, "Argument of REDRAW must be a number");
		assert.cond(
			value > 0 && value <= 3,
			"Argument of REDRAW must be between 0 and 3",
		);

		switch (value) {
			case 0n:
				vm.printer.draw = false;
				break;
			case 1n:
				vm.printer.draw = true;
				break;
			case 2n:
				vm.printer.draw = false;
				yield* vm.printer.flush();
				break;
			case 3n:
				vm.printer.draw = true;
				yield* vm.printer.flush();
				break;
		}

		return null;
	}
}
