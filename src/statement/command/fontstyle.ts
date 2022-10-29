import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(X.expr);
export default class FontStyle extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const value = await this.arg.get().reduce(vm);
		assert.bigint(value, "Argument of FONTSTYLE must be an integer!");

		/* eslint-disable no-bitwise */
		vm.printer.font.bold = (value & (1n << 0n)) !== 0n;
		vm.printer.font.italic = (value & (1n << 1n)) !== 0n;
		vm.printer.font.strike = (value & (1n << 2n)) !== 0n;
		vm.printer.font.underline = (value & (1n << 3n)) !== 0n;
		/* eslint-enable no-bitwise */

		return null;
	}
}
