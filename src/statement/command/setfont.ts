import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R0(X.expr);
export default class SetFont extends Statement {
	public arg: Lazy<Expr | undefined>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		// TODO: use default font
		const font = await this.arg.get()?.reduce(vm) ?? "";
		assert.string(font, "Argument of SETFONT must be a string");

		vm.printer.font.name = font;

		return null;
	}
}
