import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import { PrintFlag } from "../../printer.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Form from "../expr/form.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R0(X.form[""]).map((form) =>
	form ?? new Form([{ value: "" }])
);
export default class DebugPrintForm extends Statement {
	public flags: Set<PrintFlag>;
	public arg: Lazy<Form>;

	public constructor(flags: PrintFlag[], raw: Slice) {
		super(raw);

		this.flags = new Set(flags);
		this.arg = new Lazy(raw, PARSER);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(_vm: VM) {
		// TODO

		return null;
	}
}
