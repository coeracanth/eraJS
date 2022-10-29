import * as U from "../../parser/util.ts";
import type VM from "../../vm.ts";
import Slice from "../../slice.ts";
import Statement from "../index.ts";

const PARSER = U.arg0R0();
export default class DumpRand extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(vm: VM) {
		vm.getValue("RANDDATA").set(vm, BigInt(vm.random.state), []);

		return null;
	}
}
