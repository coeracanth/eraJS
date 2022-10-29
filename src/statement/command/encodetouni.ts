import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(X.form[""]);
export default class EncodeToUni extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const value = await this.arg.get().reduce(vm);
		assert.string(value, "1st argument of ENCODETOUNI must be a string");
		const buffer = Buffer.from(value, "utf8");
		vm.getValue("RESULT").set(vm, BigInt(buffer.byteLength), [0]);
		for (let i = 0; i < buffer.byteLength; ++i) {
			vm.getValue("RESULT").set(vm, BigInt(buffer[i]), [i + 1]);
		}

		return null;
	}
}
