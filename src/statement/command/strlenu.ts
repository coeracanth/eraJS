import * as assert from "../../assert.ts";
import * as C from "../../parser/const.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(C.charSeq());
export default class StrLen extends Statement {
	public arg: Lazy<string>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(vm: VM) {
		const value = this.arg.get();
		assert.string(value, "Argument of STRLENU must be a string!");
		vm.getValue("RESULT").set(vm, BigInt(value.length), [0]);

		return null;
	}
}
