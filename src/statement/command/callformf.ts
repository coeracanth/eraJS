import * as assert from "../../assert.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Form from "../expr/form.ts";
import Statement from "../index.ts";
import CallF from "./callf.ts";
import CallForm from "./callform.ts";

export default class CallFormF extends Statement {
	public arg: Lazy<[Form, Array<Expr | undefined>]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, CallForm.PARSER("(,"));
	}

	public async *run(vm: VM) {
		const [targetExpr, argExpr] = this.arg.get();
		const target = await targetExpr.reduce(vm);
		assert.string(target, "1st argument of CALLFORMF must be a string");

		return yield* CallF.exec(vm, target, argExpr);
	}
}
