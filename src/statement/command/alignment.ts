import Lazy from "../../lazy.ts";
import * as U from "../../parser/util.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";

export type Align = "LEFT" | "CENTER" | "RIGHT";

const PARSER = U.arg1R1(U.alt("LEFT", "CENTER", "RIGHT"));
export default class Alignment extends Statement {
	public arg: Lazy<Align>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(vm: VM) {
		vm.printer.align = this.arg.get();

		return null;
	}
}
