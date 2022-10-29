import * as assert from "../../assert.ts";
import * as C from "../../parser/const.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Statement, { EraGenerator } from "../index.ts";

const PARSER = U.arg1R0(C.charSeq());
export default class OneInputS extends Statement {
	public arg: Lazy<string | undefined>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM): EraGenerator {
		const arg = this.arg.get();

		let input = yield* vm.printer.input(false, arg != null);
		assert.string(
			input,
			"Input value for ONEINPUTS should be a valid string",
		);
		if (arg != null && input === "") {
			input = arg;
		}
		yield* vm.printer.print(input, new Set(["S"]));
		vm.getValue("RESULTS").set(vm, input[0], [0]);

		return null;
	}
}
