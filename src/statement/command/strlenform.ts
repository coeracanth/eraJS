import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Form from "../expr/form.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(X.form[""]);
export default class StrLenForm extends Statement {
	public arg: Lazy<Form>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const value = await this.arg.get().reduce(vm);
		assert.string(value, "Argument of STRLENFORM must be a string!");
		vm.getValue("RESULT").set(vm, BigInt(value.length), [0]);

		return null;
	}
}
