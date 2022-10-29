import * as U from "../../parser/util.ts";
import Slice from "../../slice.ts";
import VM from "../../vm.ts";
import Statement from "../index.ts";

const PARSER = U.arg0R0();
export default class PrintCPerLine extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(vm: VM) {
		vm.getValue("RESULT").set(vm, BigInt(vm.printCPerLine), [0]);

		return null;
	}
}
