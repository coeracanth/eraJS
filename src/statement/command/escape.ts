import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(X.expr);
export default class Escape extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const value = await this.arg.get().reduce(vm);
		assert.string(value, "1st argument of ESCAPE must be a string");

		let result = value;
		result = result.replace("\\", "\\\\");
		result = result.replace("*", "\\*");
		result = result.replace("+", "\\+");
		result = result.replace("?", "\\?");
		result = result.replace("|", "\\|");
		result = result.replace("{", "\\}");
		result = result.replace("[", "\\[");
		result = result.replace("(", "\\(");
		result = result.replace(")", "\\)");
		result = result.replace("^", "\\^");
		result = result.replace("$", "\\$");
		result = result.replace(".", "\\.");
		result = result.replace("#", "\\#");

		vm.getValue("RESULTS").set(vm, result, [0]);

		return null;
	}
}
