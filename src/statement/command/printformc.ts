import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
import Print from "./print";

const PARSER = U.arg1R0(E.form[""]).map((form) => form ?? new Form([{value: ""}]));
export default class PrintFormC extends Statement {
	public align: "LEFT" | "RIGHT";
	public postfix: string;
	public arg: Lazy<Form>;

	public constructor(align: PrintFormC["align"], postfix: string, raw: Slice) {
		super(raw);

		this.align = align;
		this.postfix = postfix;
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		yield* vm.print(this.arg.get().reduce(vm), this.align);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
